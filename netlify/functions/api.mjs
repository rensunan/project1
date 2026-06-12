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
  const d = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 200000, hash: "SHA-256" }, km, 256);
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      }
    });
  }

  try {
    const store = getStore("personal-cloud");

    // Auth endpoints
    if (path === "/auth/login" && request.method === "POST") {
      const body = await request.json();
      let creds = await store.get("auth:credentials", { type: "json" });
      if (!creds) {
        const salt = generateSalt();
        const du = process.env.DEFAULT_USER || "admin"; const dp = process.env.DEFAULT_PASS || "changeme"; creds = { username: du, passwordHash: await hashPassword(dp, salt), salt };
        await store.set("auth:credentials", JSON.stringify(creds));
      }
      const ih = await hashPassword(body.password || "", creds.salt);
      if (body.username === creds.username && ih === creds.passwordHash) {
        const token = generateToken();
        await store.set("auth:token:" + token, JSON.stringify({ username: creds.username, createdAt: Date.now(), expires: Date.now() + 86400000 }));
        return json({ token, expires: Date.now() + 86400000, username: creds.username });
      }
      return error("用户名或密码错误", 401);
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
      if (!token) return error("未授权，请先登录", 401);
      const session = await store.get("auth:token:" + token, { type: "json" });
      if (!session || Date.now() > session.expires) return error("登录已过期，请重新登录", 401);
      return null;
    }

    if (path === "/auth/change" && request.method === "POST") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      const body = await request.json();
      let creds = await store.get("auth:credentials", { type: "json" });
      const ih = await hashPassword(body.currentPassword || "", creds.salt);
      if (ih !== creds.passwordHash) return error("当前密码错误", 401);
      const ns = generateSalt();
      creds = {
        username: body.newUsername || creds.username,
        passwordHash: await hashPassword(body.newPassword || process.env.DEFAULT_PASS || "changeme", ns),
        salt: ns
      };
      await store.set("auth:credentials", JSON.stringify(creds));
      return json({ success: true, username: creds.username });
    }

    if (path === "/auth/logout" && request.method === "POST") {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (token) await store.delete("auth:token:" + token);
      return json({ success: true });
    }

    // Stats
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

    // Items list / create
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
        if (item) { const { content, fileData, ...meta } = item; items.push(meta); }
      }
      items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return json(items);
    }

    if ((path === "/items" || path === "/items/") && request.method === "POST") {
      const ae = await requireAuth(request);
      if (ae) return ae;
      let body;
      const ct = request.headers.get("content-type") || "";
      if (ct.includes("multipart/form-data")) {
        let form;
        try { form = await request.formData(); } catch(e) { return error("文件上传失败: " + e.message, 400); }
        body = {};
        for (const [k, v] of form.entries()) {
          if (k === "file" || v instanceof File) {
            const file = v;
            const buf = await file.arrayBuffer();
            const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
            body.fileData = "data:" + (file.type || "application/octet-stream") + ";base64," + b64;
            body.fileName = file.name;
            body.fileType = file.type;
            body.fileSize = file.size;
          } else {
            body[k] = v;
          }
        }
      } else {
        body = await request.json();
      }
      if (!body.title || !body.category) return error("标题和分类为必填项");
      if (!CATEGORIES.includes(body.category)) return error("无效的分类");
      const id = generateId();
      const now = new Date().toISOString();
      const item = {
        id, title: body.title, content: body.content || "", category: body.category,
        fileData: body.fileData || null, fileName: body.fileName || null,
        fileType: body.fileType || null, fileSize: body.fileSize || 0,
        createdAt: now, updatedAt: now
      };
      await store.set("item:" + item.category + ":" + id, JSON.stringify(item));
      return json(item, 201);
    }

    // Single item operations
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
        return error("未找到", 404);
      }

      if (request.method === "PUT") {
        let body;
        const ct2 = request.headers.get("content-type") || "";
        if (ct2.includes("multipart/form-data")) {
          let form2;
          try { form2 = await request.formData(); } catch(e) { return error("文件上传失败: " + e.message, 400); }
          body = {};
          for (const [k, v] of form2.entries()) {
            if (k === "file" || v instanceof File) {
              const file2 = v;
              const buf2 = await file2.arrayBuffer();
              const b642 = btoa(String.fromCharCode(...new Uint8Array(buf2)));
              body.fileData = "data:" + (file2.type || "application/octet-stream") + ";base64," + b642;
              body.fileName = file2.name;
              body.fileType = file2.type;
              body.fileSize = file2.size;
            } else {
              body[k] = v;
            }
          }
        } else {
          body = await request.json();
        }
        let found = null, foundKey = null;
        for (const cat of CATEGORIES) {
          const key = "item:" + cat + ":" + itemId;
          const item = await store.get(key, { type: "json" });
          if (item) { found = item; foundKey = key; break; }
        }
        if (!found) return error("未找到", 404);
        const nc = body.category && CATEGORIES.includes(body.category) ? body.category : found.category;
        const up = {
          ...found,
          title: body.title !== void 0 ? body.title : found.title,
          content: body.content !== void 0 ? body.content : found.content,
          category: nc,
          fileData: body.fileData !== void 0 ? body.fileData : found.fileData,
          fileName: body.fileName !== void 0 ? body.fileName : found.fileName,
          fileType: body.fileType !== void 0 ? body.fileType : found.fileType,
          fileSize: body.fileSize !== void 0 ? body.fileSize : found.fileSize,
          updatedAt: new Date().toISOString()
        };
        const nk = "item:" + nc + ":" + itemId;
        if (foundKey !== nk) await store.delete(foundKey);
        await store.set(nk, JSON.stringify(up));
        return json(up);
      }

      if (request.method === "DELETE") {
        for (const cat of CATEGORIES) {
          const key = "item:" + cat + ":" + itemId;
          const item = await store.get(key, { type: "json" });
          if (item) { await store.delete(key); return json({ success: true }); }
        }
        return error("未找到", 404);
      }
    }

    return error("Not Found", 404);
  } catch (e) {
    return error("Error: " + e.message, 500);
  }
}

var config = { path: "/api/*" };
export { handler as default, config };
