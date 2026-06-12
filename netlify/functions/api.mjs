// netlify/functions/api.mjs
import { getStore } from "@netlify/blobs";
var CATEGORIES = ["images", "novels", "documents", "stickies"];
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
function error(msg, status) {
  return json({ error: msg }, status || 400);
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function generateSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const km = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const d = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 2e5, hash: "SHA-256" }, km, 256);
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function estimateSize(item) {
  let size = 0;
  if (item.fileData) {
    const c = item.fileData.indexOf(",");
    if (c > 0) size = Math.round((item.fileData.length - c - 1) * 0.75);
  }
  if (item.content) size += new TextEncoder().encode(item.content).length;
  return size;
}
async function handler(request) {
  const url = new URL(request.url);
  let p = url.pathname; p = p.replace("/.netlify/functions/api", ""); if (p.startsWith("/api")) p = p.slice(4) || "/"; const path = p;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization" }
    });
  }
  try {
    const store = getStore("personal-cloud");
    if (path === "/auth/login" && request.method === "POST") {
      const body = await request.json();
      let creds = await store.get("auth:credentials", { type: "json" });
      if (!creds) {
        const salt = generateSalt();
        creds = { username: "rsn", passwordHash: await hashPassword("131420", salt), salt };
        await store.set("auth:credentials", JSON.stringify(creds));
      }
      const ih = await hashPassword(body.password || "", creds.salt);
      if (body.username === creds.username && ih === creds.passwordHash) {
        const token = generateToken();
        await store.set("auth:token:" + token, JSON.stringify({ username: creds.username, createdAt: Date.now(), expires: Date.now() + 864e5 }));
        return json({ token, expires: Date.now() + 864e5, username: creds.username });
      }
      return error("\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF", 401);
    }
    if (path === "/auth/check" && request.method === "GET") {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (!token) return json({ valid: false });
      const session = await store.get("auth:token:" + token, { type: "json" });
      if (!session || Date.now() > session.expires) return json({ valid: false });
      return json({ valid: true });
    }
    async function requireAuth(req) {
      const auth = req.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (!token) return error("\u672A\u6388\u6743\uFF0C\u8BF7\u5148\u767B\u5F55", 401);
      const session = await store.get("auth:token:" + token, { type: "json" });
      if (!session || Date.now() > session.expires) return error("\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55", 401);
      return null;
    }
    if (path === "/auth/change" && request.method === "POST") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      const body = await request.json();
      let creds = await store.get("auth:credentials", { type: "json" });
      const ih = await hashPassword(body.currentPassword || "", creds.salt);
      if (ih !== creds.passwordHash) return error("\u5F53\u524D\u5BC6\u7801\u9519\u8BEF", 401);
      const ns = generateSalt();
      creds = { username: body.newUsername || creds.username, passwordHash: await hashPassword(body.newPassword || "131420", ns), salt: ns };
      await store.set("auth:credentials", JSON.stringify(creds));
      return json({ success: true, username: creds.username });
    }
    if (path === "/auth/logout" && request.method === "POST") {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (token) await store.delete("auth:token:" + token);
      return json({ success: true });
    }
    
    if (path === "/blob-config" && request.method === "GET") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      try {
        let ctx = {}; try { ctx = JSON.parse(process.env.NETLIFY_BLOBS_CONTEXT || "{}"); } catch(e) { ctx = {}; }
        return json({
          siteID: ctx.site_id || "",
          token: ctx.token || "",
          apiURL: ctx.url || "https://api.netlify.com"
        });
      } catch (e) {
        return error("无法获取上传配置", 500);
      }
    }

if (path === "/stats" && request.method === "GET") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      const result = await store.list({ prefix: "item:" });
      const stats = { totalSize: 0, totalItems: 0, categories: {} };
      CATEGORIES.forEach((c) => stats.categories[c] = { count: 0, size: 0 });
      for (const { key } of result.blobs) {
        const item = await store.get(key, { type: "json" });
        if (!item) continue;
        stats.totalItems++;
        const sz = estimateSize(item);
        stats.totalSize += sz;
        if (stats.categories[item.category]) {
          stats.categories[item.category].count++;
          stats.categories[item.category].size += sz;
        }
      }
      return json(stats);
    }
    if ((path === "/items" || path === "/items/") && request.method === "GET") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      if (url.searchParams.has("counts")) {
        const result2 = await store.list({ prefix: "item:" });
        const counts = { all: 0 };
        CATEGORIES.forEach((c) => counts[c] = 0);
        for (const { key } of result2.blobs) {
          counts.all++;
          const parts = key.split(":");
          if (parts.length >= 2 && counts[parts[1]] !== void 0) counts[parts[1]]++;
        }
        return json(counts);
      }
      const cat = url.searchParams.get("category") || null;
      const prefix = cat ? "item:" + cat + ":" : "item:";
      const result = await store.list({ prefix });
      const items = [];
      for (const { key } of result.blobs) {
        const item = await store.get(key, { type: "json" });
        if (item) { const { content, fileData, fileKey, ...meta } = item; items.push(meta); }
      }
      items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return json(items);
    }
    if ((path === "/items" || path === "/items/") && request.method === "POST") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      const body = await request.json();
      if (!body.title || !body.category) return error("\u6807\u9898\u548C\u5206\u7C7B\u4E3A\u5FC5\u586B\u9879");
      if (!CATEGORIES.includes(body.category)) return error("\u65E0\u6548\u7684\u5206\u7C7B");
      const id = generateId();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const item = { id, title: body.title, content: body.content || "", category: body.category, fileData: body.fileData || null, fileKey: body.fileKey || null, fileName: body.fileName || null, fileType: body.fileType || null, fileSize: body.fileSize || 0, createdAt: now, updatedAt: now };
      await store.set("item:" + item.category + ":" + id, JSON.stringify(item));
      return json(item, 201);
    }
    const match = path.match(/^\/items\/([a-z0-9]+)$/);
    if (match) {
      const ae = await requireAuth(request);
      if (ae) return ae;
      const itemId = match[1];
      if (request.method === "GET") {
        for (const cat of CATEGORIES) {
          const item = await store.get("item:" + cat + ":" + itemId, { type: "json" });
          if (item) return json(item);
        }
        return error("\u672A\u627E\u5230", 404);
      }
      if (request.method === "PUT") {
        const body = await request.json();
        let found = null, foundKey = null;
        for (const cat of CATEGORIES) {
          const key = "item:" + cat + ":" + itemId;
          const item = await store.get(key, { type: "json" });
          if (item) {
            found = item;
            foundKey = key;
            break;
          }
        }
        if (!found) return error("\u672A\u627E\u5230", 404);
        const nc = body.category && CATEGORIES.includes(body.category) ? body.category : found.category;
        const up = { ...found, title: body.title !== void 0 ? body.title : found.title, content: body.content !== void 0 ? body.content : found.content, category: nc, fileData: body.fileData !== void 0 ? body.fileData : found.fileData, fileKey: body.fileKey !== void 0 ? body.fileKey : found.fileKey, fileName: body.fileName !== void 0 ? body.fileName : found.fileName, fileType: body.fileType !== void 0 ? body.fileType : found.fileType, fileSize: body.fileSize !== void 0 ? body.fileSize : found.fileSize, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        const nk = "item:" + nc + ":" + itemId;
        if (foundKey !== nk) await store.delete(foundKey);
        await store.set(nk, JSON.stringify(up));
        return json(up);
      }
      
      if (url.pathname.endsWith("/download")) {
        const token2 = url.searchParams.get("t") || ""; if (token2) { const session = await store.get("auth:token:" + token2, { type: "json" }); if (!session || Date.now() > session.expires) return error("登录已过期", 401); } else { const ae2 = await requireAuth(request); if (ae2) return ae2; } const dlId = itemId;
        let dlItem = null;
        for (const cat of CATEGORIES) {
          const key = "item:" + cat + ":" + dlId;
          const item = await store.get(key, { type: "json" });
          if (item) { dlItem = item; break; }
        }
        if (!dlItem) return error("未找到", 404);
        if (dlItem.fileKey) {
          try {
            const blobData = await store.get(dlItem.fileKey, { type: "arrayBuffer" });
            if (!blobData) return error("文件不存在", 404);
            const headers = new Headers();
            headers.set("Content-Type", dlItem.fileType || "application/octet-stream");
            headers.set("Content-Disposition", "attachment; filename=" + encodeURIComponent(dlItem.fileName || "download"));
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Access-Control-Expose-Headers", "Content-Disposition");
            return new Response(blobData, { status: 200, headers });
          } catch (e) {
            return error("下载失败: " + e.message, 500);
          }
        }
        if (dlItem.fileData) {
          const parts = dlItem.fileData.split(",");
          if (parts.length === 2 && parts[0].includes("base64")) {
            try {
              const binary = atob(parts[1]);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const headers = new Headers();
              headers.set("Content-Type", dlItem.fileType || "application/octet-stream");
              headers.set("Content-Disposition", "attachment; filename=" + encodeURIComponent(dlItem.fileName || "download"));
              headers.set("Access-Control-Allow-Origin", "*");
              headers.set("Access-Control-Expose-Headers", "Content-Disposition");
              return new Response(bytes, { status: 200, headers });
            } catch (e) {
              return error("下载失败", 500);
            }
          }
          return new Response(parts[1] || dlItem.fileData, {
            status: 200,
            headers: {
              "Content-Type": dlItem.fileType || "text/plain",
              "Content-Disposition": "attachment; filename=" + encodeURIComponent(dlItem.fileName || "download"),
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Expose-Headers": "Content-Disposition"
            }
          });
        }
        return error("无文件数据", 404);
      }

if (request.method === "DELETE") {
        for (const cat of CATEGORIES) {
          const key = "item:" + cat + ":" + itemId;
          const item = await store.get(key, { type: "json" });
          if (item) {
            await store.delete(key);
            return json({ success: true });
          }
        }
        return error("\u672A\u627E\u5230", 404);
      }
    }
    return error("Not Found", 404);
  } catch (e) {
    return error("Error: " + e.message, 500);
  }
}
var config = { path: "/api/*" };
export {
  config,
  handler as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvYXBpLm1qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgZ2V0U3RvcmUgfSBmcm9tIFwiQG5ldGxpZnkvYmxvYnNcIjtcblxuY29uc3QgQ0FURUdPUklFUyA9IFtcImltYWdlc1wiLCBcIm5vdmVsc1wiLCBcImRvY3VtZW50c1wiLCBcInN0aWNraWVzXCJdO1xuXG5mdW5jdGlvbiBqc29uKGRhdGEsIHN0YXR1cykge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpLCB7XG4gICAgc3RhdHVzOiBzdGF0dXMgfHwgMjAwLFxuICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiKlwiIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBlcnJvcihtc2csIHN0YXR1cykgeyByZXR1cm4ganNvbih7IGVycm9yOiBtc2cgfSwgc3RhdHVzIHx8IDQwMCk7IH1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHsgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDEwKTsgfVxuZnVuY3Rpb24gZ2VuZXJhdGVUb2tlbigpIHsgcmV0dXJuIEFycmF5LmZyb20oY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgzMikpKS5tYXAoYiA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLFwiMFwiKSkuam9pbihcIlwiKTsgfVxuZnVuY3Rpb24gZ2VuZXJhdGVTYWx0KCkgeyByZXR1cm4gQXJyYXkuZnJvbShjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSkpLm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsXCIwXCIpKS5qb2luKFwiXCIpOyB9XG5cbmFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZCwgc2FsdCkge1xuICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIGNvbnN0IGttID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXCJyYXdcIiwgZW5jb2Rlci5lbmNvZGUocGFzc3dvcmQpLCBcIlBCS0RGMlwiLCBmYWxzZSwgW1wiZGVyaXZlQml0c1wiXSk7XG4gIGNvbnN0IGQgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRlcml2ZUJpdHMoeyBuYW1lOiBcIlBCS0RGMlwiLCBzYWx0OiBlbmNvZGVyLmVuY29kZShzYWx0KSwgaXRlcmF0aW9uczogMjAwMDAwLCBoYXNoOiBcIlNIQS0yNTZcIiB9LCBrbSwgMjU2KTtcbiAgcmV0dXJuIEFycmF5LmZyb20obmV3IFVpbnQ4QXJyYXkoZCkpLm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsXCIwXCIpKS5qb2luKFwiXCIpO1xufVxuXG5mdW5jdGlvbiBlc3RpbWF0ZVNpemUoaXRlbSkge1xuICBsZXQgc2l6ZSA9IDA7XG4gIGlmIChpdGVtLmZpbGVEYXRhKSB7IGNvbnN0IGMgPSBpdGVtLmZpbGVEYXRhLmluZGV4T2YoXCIsXCIpOyBpZiAoYyA+IDApIHNpemUgPSBNYXRoLnJvdW5kKChpdGVtLmZpbGVEYXRhLmxlbmd0aCAtIGMgLSAxKSAqIDAuNzUpOyB9XG4gIGlmIChpdGVtLmNvbnRlbnQpIHNpemUgKz0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGl0ZW0uY29udGVudCkubGVuZ3RoO1xuICByZXR1cm4gc2l6ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXF1ZXN0KSB7XG4gIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICBjb25zdCBwYXRoID0gdXJsLnBhdGhuYW1lLnJlcGxhY2UoXCIvLm5ldGxpZnkvZnVuY3Rpb25zL2FwaVwiLCBcIlwiKTtcblxuICBpZiAocmVxdWVzdC5tZXRob2QgPT09IFwiT1BUSU9OU1wiKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgICBzdGF0dXM6IDIwNCxcbiAgICAgIGhlYWRlcnM6IHsgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiBcIkdFVCxQT1NULFBVVCxERUxFVEUsT1BUSU9OU1wiLCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCJDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvblwiIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZShcInBlcnNvbmFsLWNsb3VkXCIpO1xuXG4gICAgLy8gPT09PT0gQVVUSCA9PT09PVxuICAgIGlmIChwYXRoID09PSBcIi9hdXRoL2xvZ2luXCIgJiYgcmVxdWVzdC5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgICBsZXQgY3JlZHMgPSBhd2FpdCBzdG9yZS5nZXQoXCJhdXRoOmNyZWRlbnRpYWxzXCIsIHsgdHlwZTogXCJqc29uXCIgfSk7XG4gICAgICBpZiAoIWNyZWRzKSB7XG4gICAgICAgIGNvbnN0IHNhbHQgPSBnZW5lcmF0ZVNhbHQoKTtcbiAgICAgICAgY3JlZHMgPSB7IHVzZXJuYW1lOiBcInJzblwiLCBwYXNzd29yZEhhc2g6IGF3YWl0IGhhc2hQYXNzd29yZChcIjEzMTQyMFwiLCBzYWx0KSwgc2FsdCB9O1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoXCJhdXRoOmNyZWRlbnRpYWxzXCIsIEpTT04uc3RyaW5naWZ5KGNyZWRzKSk7XG4gICAgICB9XG4gICAgICBjb25zdCBpaCA9IGF3YWl0IGhhc2hQYXNzd29yZChib2R5LnBhc3N3b3JkIHx8IFwiXCIsIGNyZWRzLnNhbHQpO1xuICAgICAgaWYgKGJvZHkudXNlcm5hbWUgPT09IGNyZWRzLnVzZXJuYW1lICYmIGloID09PSBjcmVkcy5wYXNzd29yZEhhc2gpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBnZW5lcmF0ZVRva2VuKCk7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldChcImF1dGg6dG9rZW46XCIgKyB0b2tlbiwgSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZTogY3JlZHMudXNlcm5hbWUsIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSwgZXhwaXJlczogRGF0ZS5ub3coKSArIDg2NDAwMDAwIH0pKTtcbiAgICAgICAgcmV0dXJuIGpzb24oeyB0b2tlbiwgZXhwaXJlczogRGF0ZS5ub3coKSArIDg2NDAwMDAwLCB1c2VybmFtZTogY3JlZHMudXNlcm5hbWUgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyb3IoXCJcdTc1MjhcdTYyMzdcdTU0MERcdTYyMTZcdTVCQzZcdTc4MDFcdTk1MTlcdThCRUZcIiwgNDAxKTtcbiAgICB9XG5cbiAgICBpZiAocGF0aCA9PT0gXCIvYXV0aC9jaGVja1wiICYmIHJlcXVlc3QubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICBjb25zdCBhdXRoID0gcmVxdWVzdC5oZWFkZXJzLmdldChcIkF1dGhvcml6YXRpb25cIikgfHwgXCJcIjtcbiAgICAgIGNvbnN0IHRva2VuID0gYXV0aC5zdGFydHNXaXRoKFwiQmVhcmVyIFwiKSA/IGF1dGguc2xpY2UoNykgOiBcIlwiO1xuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuIGpzb24oeyB2YWxpZDogZmFsc2UgfSk7XG4gICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgc3RvcmUuZ2V0KFwiYXV0aDp0b2tlbjpcIiArIHRva2VuLCB7IHR5cGU6IFwianNvblwiIH0pO1xuICAgICAgaWYgKCFzZXNzaW9uIHx8IERhdGUubm93KCkgPiBzZXNzaW9uLmV4cGlyZXMpIHJldHVybiBqc29uKHsgdmFsaWQ6IGZhbHNlIH0pO1xuICAgICAgcmV0dXJuIGpzb24oeyB2YWxpZDogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICAvLyBBdXRoIG1pZGRsZXdhcmVcbiAgICBhc3luYyBmdW5jdGlvbiByZXF1aXJlQXV0aChyZXEpIHtcbiAgICAgIGNvbnN0IGF1dGggPSByZXEuaGVhZGVycy5nZXQoXCJBdXRob3JpemF0aW9uXCIpIHx8IFwiXCI7XG4gICAgICBjb25zdCB0b2tlbiA9IGF1dGguc3RhcnRzV2l0aChcIkJlYXJlciBcIikgPyBhdXRoLnNsaWNlKDcpIDogXCJcIjtcbiAgICAgIGlmICghdG9rZW4pIHJldHVybiBlcnJvcihcIlx1NjcyQVx1NjM4OFx1Njc0M1x1RkYwQ1x1OEJGN1x1NTE0OFx1NzY3Qlx1NUY1NVwiLCA0MDEpO1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHN0b3JlLmdldChcImF1dGg6dG9rZW46XCIgKyB0b2tlbiwgeyB0eXBlOiBcImpzb25cIiB9KTtcbiAgICAgIGlmICghc2Vzc2lvbiB8fCBEYXRlLm5vdygpID4gc2Vzc2lvbi5leHBpcmVzKSByZXR1cm4gZXJyb3IoXCJcdTc2N0JcdTVGNTVcdTVERjJcdThGQzdcdTY3MUZcdUZGMENcdThCRjdcdTkxQ0RcdTY1QjBcdTc2N0JcdTVGNTVcIiwgNDAxKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChwYXRoID09PSBcIi9hdXRoL2NoYW5nZVwiICYmIHJlcXVlc3QubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgY29uc3QgYWUgPSBhd2FpdCByZXF1aXJlQXV0aChyZXF1ZXN0KTsgaWYgKGFlKSByZXR1cm4gYWU7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgICBsZXQgY3JlZHMgPSBhd2FpdCBzdG9yZS5nZXQoXCJhdXRoOmNyZWRlbnRpYWxzXCIsIHsgdHlwZTogXCJqc29uXCIgfSk7XG4gICAgICBjb25zdCBpaCA9IGF3YWl0IGhhc2hQYXNzd29yZChib2R5LmN1cnJlbnRQYXNzd29yZCB8fCBcIlwiLCBjcmVkcy5zYWx0KTtcbiAgICAgIGlmIChpaCAhPT0gY3JlZHMucGFzc3dvcmRIYXNoKSByZXR1cm4gZXJyb3IoXCJcdTVGNTNcdTUyNERcdTVCQzZcdTc4MDFcdTk1MTlcdThCRUZcIiwgNDAxKTtcbiAgICAgIGNvbnN0IG5zID0gZ2VuZXJhdGVTYWx0KCk7XG4gICAgICBjcmVkcyA9IHsgdXNlcm5hbWU6IGJvZHkubmV3VXNlcm5hbWUgfHwgY3JlZHMudXNlcm5hbWUsIHBhc3N3b3JkSGFzaDogYXdhaXQgaGFzaFBhc3N3b3JkKGJvZHkubmV3UGFzc3dvcmQgfHwgXCIxMzE0MjBcIiwgbnMpLCBzYWx0OiBucyB9O1xuICAgICAgYXdhaXQgc3RvcmUuc2V0KFwiYXV0aDpjcmVkZW50aWFsc1wiLCBKU09OLnN0cmluZ2lmeShjcmVkcykpO1xuICAgICAgcmV0dXJuIGpzb24oeyBzdWNjZXNzOiB0cnVlLCB1c2VybmFtZTogY3JlZHMudXNlcm5hbWUgfSk7XG4gICAgfVxuXG4gICAgaWYgKHBhdGggPT09IFwiL2F1dGgvbG9nb3V0XCIgJiYgcmVxdWVzdC5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBhdXRoID0gcmVxdWVzdC5oZWFkZXJzLmdldChcIkF1dGhvcml6YXRpb25cIikgfHwgXCJcIjtcbiAgICAgIGNvbnN0IHRva2VuID0gYXV0aC5zdGFydHNXaXRoKFwiQmVhcmVyIFwiKSA/IGF1dGguc2xpY2UoNykgOiBcIlwiO1xuICAgICAgaWYgKHRva2VuKSBhd2FpdCBzdG9yZS5kZWxldGUoXCJhdXRoOnRva2VuOlwiICsgdG9rZW4pO1xuICAgICAgcmV0dXJuIGpzb24oeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIC8vID09PT09IERBVEEgKHByb3RlY3RlZCkgPT09PT1cbiAgICBpZiAocGF0aCA9PT0gXCIvc3RhdHNcIiAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3QgYWUgPSBhd2FpdCByZXF1aXJlQXV0aChyZXF1ZXN0KTsgaWYgKGFlKSByZXR1cm4gYWU7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzdG9yZS5saXN0KHsgcHJlZml4OiBcIml0ZW06XCIgfSk7XG4gICAgICBjb25zdCBzdGF0cyA9IHsgdG90YWxTaXplOiAwLCB0b3RhbEl0ZW1zOiAwLCBjYXRlZ29yaWVzOiB7fSB9O1xuICAgICAgQ0FURUdPUklFUy5mb3JFYWNoKGMgPT4gc3RhdHMuY2F0ZWdvcmllc1tjXSA9IHsgY291bnQ6IDAsIHNpemU6IDAgfSk7XG4gICAgICBmb3IgKGNvbnN0IHsga2V5IH0gb2YgcmVzdWx0LmJsb2JzKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBzdG9yZS5nZXQoa2V5LCB7IHR5cGU6IFwianNvblwiIH0pO1xuICAgICAgICBpZiAoIWl0ZW0pIGNvbnRpbnVlO1xuICAgICAgICBzdGF0cy50b3RhbEl0ZW1zKys7XG4gICAgICAgIGNvbnN0IHN6ID0gZXN0aW1hdGVTaXplKGl0ZW0pO1xuICAgICAgICBzdGF0cy50b3RhbFNpemUgKz0gc3o7XG4gICAgICAgIGlmIChzdGF0cy5jYXRlZ29yaWVzW2l0ZW0uY2F0ZWdvcnldKSB7IHN0YXRzLmNhdGVnb3JpZXNbaXRlbS5jYXRlZ29yeV0uY291bnQrKzsgc3RhdHMuY2F0ZWdvcmllc1tpdGVtLmNhdGVnb3J5XS5zaXplICs9IHN6OyB9XG4gICAgICB9XG4gICAgICByZXR1cm4ganNvbihzdGF0cyk7XG4gICAgfVxuXG4gICAgaWYgKChwYXRoID09PSBcIi9pdGVtc1wiIHx8IHBhdGggPT09IFwiL2l0ZW1zL1wiKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3QgYWUgPSBhd2FpdCByZXF1aXJlQXV0aChyZXF1ZXN0KTsgaWYgKGFlKSByZXR1cm4gYWU7XG4gICAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoXCJjb3VudHNcIikpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3RvcmUubGlzdCh7IHByZWZpeDogXCJpdGVtOlwiIH0pO1xuICAgICAgICBjb25zdCBjb3VudHMgPSB7IGFsbDogMCB9OyBDQVRFR09SSUVTLmZvckVhY2goYyA9PiBjb3VudHNbY10gPSAwKTtcbiAgICAgICAgZm9yIChjb25zdCB7IGtleSB9IG9mIHJlc3VsdC5ibG9icykge1xuICAgICAgICAgIGNvdW50cy5hbGwrKztcbiAgICAgICAgICBjb25zdCBwYXJ0cyA9IGtleS5zcGxpdChcIjpcIik7XG4gICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+PSAyICYmIGNvdW50c1twYXJ0c1sxXV0gIT09IHVuZGVmaW5lZCkgY291bnRzW3BhcnRzWzFdXSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqc29uKGNvdW50cyk7XG4gICAgICB9XG4gICAgICBjb25zdCBjYXQgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcImNhdGVnb3J5XCIpIHx8IG51bGw7XG4gICAgICBjb25zdCBwcmVmaXggPSBjYXQgPyBcIml0ZW06XCIgKyBjYXQgKyBcIjpcIiA6IFwiaXRlbTpcIjtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0b3JlLmxpc3QoeyBwcmVmaXggfSk7XG4gICAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCB7IGtleSB9IG9mIHJlc3VsdC5ibG9icykge1xuICAgICAgICBjb25zdCBpdGVtID0gYXdhaXQgc3RvcmUuZ2V0KGtleSwgeyB0eXBlOiBcImpzb25cIiB9KTtcbiAgICAgICAgaWYgKGl0ZW0pIGl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLnVwZGF0ZWRBdCkgLSBuZXcgRGF0ZShhLnVwZGF0ZWRBdCkpO1xuICAgICAgcmV0dXJuIGpzb24oaXRlbXMpO1xuICAgIH1cblxuICAgIGlmICgocGF0aCA9PT0gXCIvaXRlbXNcIiB8fCBwYXRoID09PSBcIi9pdGVtcy9cIikgJiYgcmVxdWVzdC5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBhZSA9IGF3YWl0IHJlcXVpcmVBdXRoKHJlcXVlc3QpOyBpZiAoYWUpIHJldHVybiBhZTtcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcbiAgICAgIGlmICghYm9keS50aXRsZSB8fCAhYm9keS5jYXRlZ29yeSkgcmV0dXJuIGVycm9yKFwiXHU2ODA3XHU5ODk4XHU1NDhDXHU1MjA2XHU3QzdCXHU0RTNBXHU1RkM1XHU1ODZCXHU5ODc5XCIpO1xuICAgICAgaWYgKCFDQVRFR09SSUVTLmluY2x1ZGVzKGJvZHkuY2F0ZWdvcnkpKSByZXR1cm4gZXJyb3IoXCJcdTY1RTBcdTY1NDhcdTc2ODRcdTUyMDZcdTdDN0JcIik7XG4gICAgICBjb25zdCBpZCA9IGdlbmVyYXRlSWQoKTsgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgY29uc3QgaXRlbSA9IHsgaWQsIHRpdGxlOiBib2R5LnRpdGxlLCBjb250ZW50OiBib2R5LmNvbnRlbnQgfHwgXCJcIiwgY2F0ZWdvcnk6IGJvZHkuY2F0ZWdvcnksIGZpbGVEYXRhOiBib2R5LmZpbGVEYXRhIHx8IG51bGwsIGZpbGVOYW1lOiBib2R5LmZpbGVOYW1lIHx8IG51bGwsIGZpbGVUeXBlOiBib2R5LmZpbGVUeXBlIHx8IG51bGwsIGZpbGVTaXplOiBib2R5LmZpbGVTaXplIHx8IDAsIGNyZWF0ZWRBdDogbm93LCB1cGRhdGVkQXQ6IG5vdyB9O1xuICAgICAgYXdhaXQgc3RvcmUuc2V0KFwiaXRlbTpcIiArIGl0ZW0uY2F0ZWdvcnkgKyBcIjpcIiArIGlkLCBKU09OLnN0cmluZ2lmeShpdGVtKSk7XG4gICAgICByZXR1cm4ganNvbihpdGVtLCAyMDEpO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoID0gcGF0aC5tYXRjaCgvXlxcL2l0ZW1zXFwvKFthLXowLTldKykkLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCBhZSA9IGF3YWl0IHJlcXVpcmVBdXRoKHJlcXVlc3QpOyBpZiAoYWUpIHJldHVybiBhZTtcbiAgICAgIGNvbnN0IGl0ZW1JZCA9IG1hdGNoWzFdO1xuXG4gICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09IFwiR0VUXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBjYXQgb2YgQ0FURUdPUklFUykge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBzdG9yZS5nZXQoXCJpdGVtOlwiICsgY2F0ICsgXCI6XCIgKyBpdGVtSWQsIHsgdHlwZTogXCJqc29uXCIgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0pIHJldHVybiBqc29uKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvcihcIlx1NjcyQVx1NjI3RVx1NTIzMFwiLCA0MDQpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09IFwiUFVUXCIpIHtcbiAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgICAgICBsZXQgZm91bmQgPSBudWxsLCBmb3VuZEtleSA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2F0IG9mIENBVEVHT1JJRVMpIHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBcIml0ZW06XCIgKyBjYXQgKyBcIjpcIiArIGl0ZW1JZDtcbiAgICAgICAgICBjb25zdCBpdGVtID0gYXdhaXQgc3RvcmUuZ2V0KGtleSwgeyB0eXBlOiBcImpzb25cIiB9KTtcbiAgICAgICAgICBpZiAoaXRlbSkgeyBmb3VuZCA9IGl0ZW07IGZvdW5kS2V5ID0ga2V5OyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZm91bmQpIHJldHVybiBlcnJvcihcIlx1NjcyQVx1NjI3RVx1NTIzMFwiLCA0MDQpO1xuICAgICAgICBjb25zdCBuYyA9IChib2R5LmNhdGVnb3J5ICYmIENBVEVHT1JJRVMuaW5jbHVkZXMoYm9keS5jYXRlZ29yeSkpID8gYm9keS5jYXRlZ29yeSA6IGZvdW5kLmNhdGVnb3J5O1xuICAgICAgICBjb25zdCB1cCA9IHsgLi4uZm91bmQsIHRpdGxlOiBib2R5LnRpdGxlICE9PSB1bmRlZmluZWQgPyBib2R5LnRpdGxlIDogZm91bmQudGl0bGUsIGNvbnRlbnQ6IGJvZHkuY29udGVudCAhPT0gdW5kZWZpbmVkID8gYm9keS5jb250ZW50IDogZm91bmQuY29udGVudCwgY2F0ZWdvcnk6IG5jLCBmaWxlRGF0YTogYm9keS5maWxlRGF0YSAhPT0gdW5kZWZpbmVkID8gYm9keS5maWxlRGF0YSA6IGZvdW5kLmZpbGVEYXRhLCBmaWxlTmFtZTogYm9keS5maWxlTmFtZSAhPT0gdW5kZWZpbmVkID8gYm9keS5maWxlTmFtZSA6IGZvdW5kLmZpbGVOYW1lLCBmaWxlVHlwZTogYm9keS5maWxlVHlwZSAhPT0gdW5kZWZpbmVkID8gYm9keS5maWxlVHlwZSA6IGZvdW5kLmZpbGVUeXBlLCBmaWxlU2l6ZTogYm9keS5maWxlU2l6ZSAhPT0gdW5kZWZpbmVkID8gYm9keS5maWxlU2l6ZSA6IGZvdW5kLmZpbGVTaXplLCB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9O1xuICAgICAgICBjb25zdCBuayA9IFwiaXRlbTpcIiArIG5jICsgXCI6XCIgKyBpdGVtSWQ7XG4gICAgICAgIGlmIChmb3VuZEtleSAhPT0gbmspIGF3YWl0IHN0b3JlLmRlbGV0ZShmb3VuZEtleSk7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldChuaywgSlNPTi5zdHJpbmdpZnkodXApKTtcbiAgICAgICAgcmV0dXJuIGpzb24odXApO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09IFwiREVMRVRFXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBjYXQgb2YgQ0FURUdPUklFUykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IFwiaXRlbTpcIiArIGNhdCArIFwiOlwiICsgaXRlbUlkO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBzdG9yZS5nZXQoa2V5LCB7IHR5cGU6IFwianNvblwiIH0pO1xuICAgICAgICAgIGlmIChpdGVtKSB7IGF3YWl0IHN0b3JlLmRlbGV0ZShrZXkpOyByZXR1cm4ganNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3IoXCJcdTY3MkFcdTYyN0VcdTUyMzBcIiwgNDA0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZXJyb3IoXCJOb3QgRm91bmRcIiwgNDA0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlcnJvcihcIkVycm9yOiBcIiArIGUubWVzc2FnZSwgNTAwKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY29uZmlnID0geyBwYXRoOiBcIi9hcGkvKlwiIH07Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLFNBQVMsZ0JBQWdCO0FBRXpCLElBQU0sYUFBYSxDQUFDLFVBQVUsVUFBVSxhQUFhLFVBQVU7QUFFL0QsU0FBUyxLQUFLLE1BQU0sUUFBUTtBQUMxQixTQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQUEsSUFDeEMsUUFBUSxVQUFVO0FBQUEsSUFDbEIsU0FBUyxFQUFFLGdCQUFnQixvQkFBb0IsK0JBQStCLElBQUk7QUFBQSxFQUNwRixDQUFDO0FBQ0g7QUFDQSxTQUFTLE1BQU0sS0FBSyxRQUFRO0FBQUUsU0FBTyxLQUFLLEVBQUUsT0FBTyxJQUFJLEdBQUcsVUFBVSxHQUFHO0FBQUc7QUFFMUUsU0FBUyxhQUFhO0FBQUUsU0FBTyxLQUFLLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxLQUFLLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRTtBQUFHO0FBQ3RHLFNBQVMsZ0JBQWdCO0FBQUUsU0FBTyxNQUFNLEtBQUssT0FBTyxnQkFBZ0IsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxPQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFHO0FBQzVJLFNBQVMsZUFBZTtBQUFFLFNBQU8sTUFB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
