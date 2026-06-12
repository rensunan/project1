// ============================================================
// 个人云数据存储 - Cloudflare Worker (优化版)
// ============================================================
import { HTML } from './html.js';

const CATEGORIES = ["images", "novels", "documents", "stickies"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_USERNAME = 'rsn';
const DEFAULT_PASSWORD = '131420';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
function error(msg, status = 400) { return json({ error: msg }, status); }

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 10); }
function generateToken() { return Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2,'0')).join(''); }
function generateSalt() { return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join(''); }

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const d = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 200000, hash: 'SHA-256' }, km, 256);
  return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function getCredentials(env) {
  let creds = await env.PERSONAL_CLOUD_KV.get('auth:credentials', 'json');
  if (!creds) {
    const salt = generateSalt();
    creds = { username: DEFAULT_USERNAME, passwordHash: await hashPassword(DEFAULT_PASSWORD, salt), salt };
    await env.PERSONAL_CLOUD_KV.put('auth:credentials', JSON.stringify(creds));
  }
  return creds;
}

async function validateToken(env, token) {
  if (!token) return false;
  const session = await env.PERSONAL_CLOUD_KV.get('auth:token:' + token, 'json');
  if (!session || Date.now() > session.expires) return false;
  return true;
}

async function requireAuth(request, env) {
  let token = '';
  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) token = auth.slice(7);
  if (!token) {
    const url = new URL(request.url);
    token = url.searchParams.get('t') || '';
  }
  if (!(await validateToken(env, token))) return error('未授权，请先登录', 401);
  return null;
}

function estimateSize(item) {
  let size = item.fileSize || 0;
  if (item.content) size += new TextEncoder().encode(item.content).length;
  return size;
}

async function getStorageStats(env) {
  const all = await env.PERSONAL_CLOUD_KV.list({ prefix: 'item:' });
  const stats = { totalSize: 0, totalItems: 0, categories: {} };
  CATEGORIES.forEach(c => stats.categories[c] = { count: 0, size: 0 });
  for (const key of all.keys) {
    const val = await env.PERSONAL_CLOUD_KV.get(key.name, 'json');
    if (!val) continue;
    stats.totalItems++;
    stats.totalSize += estimateSize(val);
    if (stats.categories[val.category]) { stats.categories[val.category].count++; stats.categories[val.category].size += estimateSize(val); }
  }
  return stats;
}

async function listItems(env, category) {
  const prefix = category ? 'item:' + category + ':' : 'item:';
  const result = await env.PERSONAL_CLOUD_KV.list({ prefix });
  const items = [];
  for (const key of result.keys) {
    const val = await env.PERSONAL_CLOUD_KV.get(key.name, 'json');
    if (val) { const { content, fileData, ...meta } = val; items.push(meta); }
  }
  items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return items;
}

async function getCounts(env) {
  const all = await env.PERSONAL_CLOUD_KV.list({ prefix: 'item:' });
  const counts = { all: 0 };
  CATEGORIES.forEach(c => counts[c] = 0);
  for (const key of all.keys) { counts.all++; const parts = key.name.split(':'); if (parts.length >= 2 && counts[parts[1]] !== undefined) counts[parts[1]]++; }
  return counts;
}

async function findItem(env, itemId) {
  for (const cat of CATEGORIES) {
    const item = await env.PERSONAL_CLOUD_KV.get('item:' + cat + ':' + itemId, 'json');
    if (item) return { item, key: 'item:' + cat + ':' + itemId };
  }
  return null;
}

// Parse multipart form data
async function parseFormData(request) {
  const form = await request.formData();
  const result = {};
  for (const [key, value] of form) {
    if (value instanceof File) {
      result._file = value;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
    }

    if (path === '/' || path === '/index.html') {
      return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ===== AUTH =====
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json();
        const creds = await getCredentials(env);
        const ih = await hashPassword(body.password || '', creds.salt);
        if (body.username === creds.username && ih === creds.passwordHash) {
          const token = generateToken();
          await env.PERSONAL_CLOUD_KV.put('auth:token:' + token, JSON.stringify({ username: creds.username, createdAt: Date.now(), expires: Date.now() + 86400000 }));
          return json({ token, expires: Date.now() + 86400000, username: creds.username });
        }
        return error('用户名或密码错误', 401);
      } catch (e) { return error('请求格式错误'); }
    }

    if (path === '/api/auth/check' && request.method === 'GET') {
      const auth = request.headers.get('Authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      return json({ valid: await validateToken(env, token) });
    }

    if (path === '/api/auth/change' && request.method === 'POST') {
      const ae = await requireAuth(request, env); if (ae) return ae;
      try {
        const body = await request.json();
        const creds = await getCredentials(env);
        const ih = await hashPassword(body.currentPassword || '', creds.salt);
        if (ih !== creds.passwordHash) return error('当前密码错误', 401);
        const ns = generateSalt();
        const nc = { username: body.newUsername || creds.username, passwordHash: await hashPassword(body.newPassword || DEFAULT_PASSWORD, ns), salt: ns };
        await env.PERSONAL_CLOUD_KV.put('auth:credentials', JSON.stringify(nc));
        return json({ success: true, username: nc.username });
      } catch (e) { return error('请求格式错误'); }
    }

    if (path === '/api/auth/logout' && request.method === 'POST') {
      const auth = request.headers.get('Authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (token) await env.PERSONAL_CLOUD_KV.delete('auth:token:' + token);
      return json({ success: true });
    }

    // ===== DATA =====
    if (path === '/api/stats' && request.method === 'GET') {
      const ae = await requireAuth(request, env); if (ae) return ae;
      return json(await getStorageStats(env));
    }

    if ((path === '/api/items' || path === '/api/items/') && request.method === 'GET') {
      const ae = await requireAuth(request, env); if (ae) return ae;
      if (url.searchParams.has('counts')) return json(await getCounts(env));
      return json(await listItems(env, url.searchParams.get('category') || null));
    }

    // ===== CREATE (JSON or FormData) =====
    if ((path === '/api/items' || path === '/api/items/') && request.method === 'POST') {
      const ae = await requireAuth(request, env); if (ae) return ae;
      try {
        const contentType = request.headers.get('Content-Type') || '';
        let title, content, category, fileData = null, fileName = null, fileType = null, fileSize = 0;

        if (contentType.includes('multipart/form-data')) {
          const form = await parseFormData(request);
          title = form.title; content = form.content || ''; category = form.category;
          if (form._file) {
            if (form._file.size > MAX_FILE_SIZE) return error('文件不能超过50MB');
            fileData = await form._file.arrayBuffer();
            fileName = form._file.name;
            fileType = form._file.type;
            fileSize = form._file.size;
          }
        } else {
          const body = await request.json();
          title = body.title; content = body.content || ''; category = body.category;
          if (body.fileData) {
            // Legacy base64 handling
            const comma = body.fileData.indexOf(',');
            if (comma > 0) {
              const b64 = body.fileData.substring(comma + 1);
              fileData = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
              fileName = body.fileName; fileType = body.fileType; fileSize = body.fileSize;
            }
          }
        }

        if (!title || !category) return error('标题和分类为必填项');
        if (!CATEGORIES.includes(category)) return error('无效的分类');

        const id = generateId(); const now = new Date().toISOString();
        const item = { id, title, content, category, fileName: fileName || null, fileType: fileType || null, fileSize: fileSize || 0, hasFile: !!fileData, createdAt: now, updatedAt: now };

        // Store file binary separately if present
        if (fileData) {
          await env.PERSONAL_CLOUD_KV.put('file:' + id, fileData);
        }
        await env.PERSONAL_CLOUD_KV.put('item:' + category + ':' + id, JSON.stringify(item));
        return json(item, 201);
      } catch (e) { return error('请求格式错误: ' + e.message); }
    }

    // ===== FILE DOWNLOAD =====
    const dlMatch = path.match(/^\/api\/items\/([a-z0-9]+)\/download$/);
    if (dlMatch && request.method === 'GET') {
      const ae = await requireAuth(request, env); if (ae) return ae;
      const itemId = dlMatch[1];
      const fileData = await env.PERSONAL_CLOUD_KV.get('file:' + itemId, 'arrayBuffer');
      if (!fileData) return error('文件未找到', 404);
      // Get metadata for filename
      const found = await findItem(env, itemId);
      const fname = found ? found.item.fileName : 'download';
      const ftype = found ? found.item.fileType : 'application/octet-stream';
      return new Response(fileData, {
        headers: { 'Content-Type': ftype || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // ===== SINGLE ITEM =====
    const match = path.match(/^\/api\/items\/([a-z0-9]+)$/);
    if (match) {
      const ae = await requireAuth(request, env); if (ae) return ae;
      const itemId = match[1];

      if (request.method === 'GET') {
        const found = await findItem(env, itemId);
        if (found) { if (found.item.fileData) delete found.item.fileData; return json(found.item); }
        return error('未找到', 404);
      }

      if (request.method === 'PUT') {
        try {
          const contentType = request.headers.get('Content-Type') || '';
          let title, content, category, fileData = null, fileName = null, fileType = null, fileSize = 0, hasFile;

          if (contentType.includes('multipart/form-data')) {
            const form = await parseFormData(request);
            title = form.title; content = form.content; category = form.category;
            if (form._file) {
              if (form._file.size > MAX_FILE_SIZE) return error('文件不能超过50MB');
              fileData = await form._file.arrayBuffer();
              fileName = form._file.name; fileType = form._file.type; fileSize = form._file.size;
              hasFile = true;
            }
          } else {
            const body = await request.json();
            title = body.title; content = body.content; category = body.category;
            if (body.fileData !== undefined) {
              if (body.fileData) {
                const comma = body.fileData.indexOf(',');
                if (comma > 0) {
                  fileData = Uint8Array.from(atob(body.fileData.substring(comma + 1)), c => c.charCodeAt(0)).buffer;
                  fileName = body.fileName; fileType = body.fileType; fileSize = body.fileSize;
                }
                hasFile = true;
              } else {
                hasFile = false;
              }
            }
          }

          const found = await findItem(env, itemId);
          if (!found) return error('未找到', 404);
          const existing = found.item;
          const nc = (category && CATEGORIES.includes(category)) ? category : existing.category;

          const updated = {
            ...existing,
            title: title !== undefined ? title : existing.title,
            content: content !== undefined ? content : existing.content,
            category: nc,
            fileName: fileName !== undefined ? fileName : existing.fileName,
            fileType: fileType !== undefined ? fileType : existing.fileType,
            fileSize: fileSize !== undefined ? fileSize : existing.fileSize,
            hasFile: hasFile !== undefined ? hasFile : existing.hasFile,
            updatedAt: new Date().toISOString()
          };

          if (fileData) {
            await env.PERSONAL_CLOUD_KV.put('file:' + itemId, fileData);
          } else if (hasFile === false) {
            await env.PERSONAL_CLOUD_KV.delete('file:' + itemId);
          }

          const nk = 'item:' + nc + ':' + itemId;
          if (found.key !== nk) await env.PERSONAL_CLOUD_KV.delete(found.key);
          await env.PERSONAL_CLOUD_KV.put(nk, JSON.stringify(updated));
          return json(updated);
        } catch (e) { return error('请求格式错误: ' + e.message); }
      }

      if (request.method === 'DELETE') {
        const found = await findItem(env, itemId);
        if (!found) return error('未找到', 404);
        await env.PERSONAL_CLOUD_KV.delete(found.key);
        await env.PERSONAL_CLOUD_KV.delete('file:' + itemId);
        return json({ success: true });
      }
    }

    return error('Not Found', 404);
  }
};