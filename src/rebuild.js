const fs = require('fs');
const src = __dirname;

// Assemble app.js cleanly from scratch
const config = `// ============================================================
// 📌 分类配置 —— 新增类型只需在这里加一行
// ============================================================
const CATEGORIES = {
  images:    { id:"images",    label:"图片",   icon:"🖼️", color:"#ec4899", hasFile:true,  pageIcon:"🖼️", pageLabel:"图片" },
  novels:    { id:"novels",    label:"小说",   icon:"📖", color:"#f59e0b", hasFile:true,  pageIcon:"📖", pageLabel:"小说" },
  documents: { id:"documents", label:"文档",   icon:"📄", color:"#10b981", hasFile:true,  pageIcon:"📄", pageLabel:"文档" },
  stickies:  { id:"stickies",  label:"便利贴", icon:"📌", color:"#8b5cf6", hasFile:false, pageIcon:"📌", pageLabel:"便利贴", isSticky:true },
};
const DEFAULT_CATEGORY = "documents";
const CATEGORY_LIST = Object.values(CATEGORIES);
const PAGE_TITLES = { all: "📋 全部项目" };
const EMPTY_ICONS = { all: "📭" };
CATEGORY_LIST.forEach(c => {
  PAGE_TITLES[c.id] = c.pageIcon + " " + c.pageLabel;
  EMPTY_ICONS[c.id] = c.icon;
});
const API="/api";
`;

const auth = `// ============================================================
// 🔐 认证 — 最先定义确保 onclick 可访问
// ============================================================
let AUTH_TOKEN = localStorage.getItem('auth_token') || '';
function setToken(token) { AUTH_TOKEN = token; localStorage.setItem('auth_token', token); }
function clearToken() { AUTH_TOKEN = ''; localStorage.removeItem('auth_token'); }

async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (AUTH_TOKEN) headers['Authorization'] = 'Bearer ' + AUTH_TOKEN;
  return fetch(API + path, { ...options, headers });
}

async function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  if (!user || !pass) { errEl.textContent = '请输入用户名和密码'; return }
  try {
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || '登录失败'; return }
    setToken(data.token);
    if (data.username) localStorage.setItem('auth_username', data.username);
    errEl.textContent = '';
    showMainApp();
  } catch (e) { errEl.textContent = '网络错误，请重试'; }
}

function toggleLoginPw() {
  const input = document.getElementById('loginPass');
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function checkAuth() {
  if (!AUTH_TOKEN) return false;
  try { const res = await apiFetch('/auth/check'); const d = await res.json(); return d.valid === true; }
  catch (e) { return false; }
}

async function logout() {
  try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) {}
  clearToken();
  closeModal();
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

function showMainApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  buildSidebar();
  setCategory('all');
  loadItems();
}

document.addEventListener('keydown', function(e) {
  const ls = document.getElementById('loginScreen');
  if (ls && ls.style.display !== 'none' && e.key === 'Enter') { doLogin(); }
});
`;

// Load the rest of the functions from the current app.js
const currentJs = fs.readFileSync(src + '/app.js', 'utf-8');

// Extract all the remaining functions (everything after the auth block)
// Find where the old code ends and the UI functions begin
const sidebarStart = currentJs.indexOf('function buildSidebar');
const remaining = currentJs.substring(sidebarStart).replace('let currentCategory', '\nlet currentCategory="all",allItems=[],currentDetailId=null;\n');

// Combine everything
const cleanJs = config + auth + remaining;

// Verify syntax
try {
  new Function(cleanJs);
  console.log('SYNTAX: OK');
} catch(e) {
  console.log('SYNTAX ERROR:', e.message);
  process.exit(1);
}

fs.writeFileSync(src + '/app.js', cleanJs, 'utf-8');
console.log('app.js rewritten cleanly (' + (cleanJs.length / 1024).toFixed(1) + ' KB)');

// Verify all key functions exist
['doLogin','toggleLoginPw','checkAuth','apiFetch','setToken','clearToken','logout','showMainApp',
 'buildSidebar','setCategory','loadItems','renderItems','viewDetail','loadDetailImage',
 'submitForm','uploadWithProgress','compressImage','handleFileSelect',
 'downloadItem','closeModal','loadStats','renderStats','openSettings','changeCredentials',
 'formatSize','toast','esc','escAttr'].forEach(fn => {
  if (!cleanJs.includes('function ' + fn) && !cleanJs.includes('async function ' + fn))
    console.log('MISSING:', fn);
});
console.log('Function check complete');
