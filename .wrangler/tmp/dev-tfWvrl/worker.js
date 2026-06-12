var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/html.js
var HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>\u2601\uFE0F \u4E2A\u4EBA\u4E91\u6570\u636E\u5B58\u50A8</title>
<style>
/* Card file icon (no image loading) */
.card-file-icon{font-size:2.8rem;text-align:center;padding:20px 0 10px;opacity:.6}
.card-file-meta{text-align:center;margin-bottom:12px}
.card-file-name{font-size:.8rem;color:var(--text);display:block;word-break:break-all}
.card-file-size{font-size:.7rem;color:var(--text2)}

/* Lazy image loader in detail */
.lazy-image{min-height:120px}
.lazy-placeholder{text-align:center;padding:40px 20px;cursor:pointer;border:2px dashed var(--border);border-radius:var(--radius);transition:all var(--transition)}
.lazy-placeholder:hover{border-color:var(--accent);background:rgba(124,92,252,.05)}
.lazy-icon{font-size:3rem;margin-bottom:10px}
.lazy-placeholder p{color:var(--text2);font-size:.85rem;margin-bottom:14px}
.detail-file-info{display:flex;align-items:center;gap:16px;padding:20px}
.file-type-icon{font-size:3rem;opacity:.6}
.text2{color:var(--text2);font-size:.82rem}

/* Upload progress bar */
.upload-progress{display:none;margin-top:10px;background:var(--surface2);border-radius:6px;height:20px;position:relative;overflow:hidden}
.upload-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--success));border-radius:6px;transition:width .2s;width:0%}
.upload-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#fff;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.3)}
/* ===== Login Screen ===== */
.login-screen{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;background:var(--bg);background-image:radial-gradient(ellipse at 20% 20%,#1a1040 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#101040 0%,transparent 50%)}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px 36px;width:90%;max-width:400px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:slideUp .4s ease}
.login-logo{font-size:3.5rem;margin-bottom:8px}
.login-card h1{font-size:1.6rem;color:var(--text);margin-bottom:6px}
.login-sub{color:var(--text2);font-size:.85rem;margin-bottom:28px}
.login-error{color:var(--danger);font-size:.82rem;min-height:20px;margin-bottom:12px;text-align:center}
.login-card .form-group{text-align:left}
.login-card .btn-primary{margin-top:4px}

/* Settings modal */
.settings-section{margin-bottom:24px}
.settings-section h3{font-size:.95rem;color:var(--text);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.user-info{display:flex;align-items:center;gap:10px;padding:12px;background:var(--surface2);border-radius:var(--radius-sm);margin-bottom:16px}
.user-info .avatar{width:40px;height:40px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#fff;flex-shrink:0}
.user-info .name{font-weight:600;color:var(--text)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f0f1a;--surface:#1a1a2e;--surface2:#222240;--border:#2a2a4a;--text:#e0e0f0;--text2:#9090b0;--accent:#7c5cfc;--accent2:#a78bfa;--danger:#f87171;--success:#34d399;--warning:#fbbf24;--info:#60a5fa;--radius:12px;--radius-sm:8px;--shadow:0 4px 24px rgba(0,0,0,.4);--transition:0.25s cubic-bezier(.4,0,.2,1)}
body{font-family:"Inter","Segoe UI",system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;background-image:radial-gradient(ellipse at 20% 20%,#1a1040 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#101040 0%,transparent 50%)}
.app{display:flex;min-height:100vh}
.sidebar{width:260px;background:rgba(26,26,46,.85);backdrop-filter:blur(20px);border-right:1px solid var(--border);padding:24px 16px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform var(--transition)}
.sidebar-logo{font-size:1.4rem;font-weight:700;margin-bottom:32px;display:flex;align-items:center;gap:10px}
.sidebar-logo span{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-group{margin-bottom:24px}
.nav-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text2);margin-bottom:8px;padding:0 8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition);color:var(--text2);font-size:.9rem;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--surface2);color:var(--text)}
.nav-item.active{background:var(--accent);color:#fff;box-shadow:0 4px 12px rgba(124,92,252,.4)}
.nav-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.nav-count{font-size:.75rem;background:var(--surface2);padding:2px 8px;border-radius:99px;margin-left:auto}
.nav-item.active .nav-count{background:rgba(255,255,255,.2)}
.main{flex:1;margin-left:260px;padding:32px}

/* ===== Storage Stats Bar ===== */
.stats-bar{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:28px}
.stats-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.stats-header h3{font-size:.95rem;color:var(--text);margin:0}
.stats-total{font-size:.85rem;color:var(--text2)}
.stats-total strong{color:var(--text);font-size:1.05rem}
.stats-progress{height:12px;background:var(--surface2);border-radius:6px;overflow:hidden;display:flex;margin-bottom:14px}
.stats-segment{height:100%;transition:width .5s ease;min-width:2px}
.stats-segment:hover{filter:brightness(1.3)}
.stats-legend{display:flex;flex-wrap:wrap;gap:12px}
.stats-legend-item{display:flex;align-items:center;gap:6px;font-size:.78rem;color:var(--text2)}
.stats-legend-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.stats-legend-item strong{color:var(--text)}
.stats-empty{text-align:center;padding:12px;color:var(--text2);font-size:.85rem}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px}
.header-title{font-size:1.8rem;font-weight:700}
.header-actions{display:flex;gap:10px}
.btn{padding:10px 20px;border-radius:var(--radius-sm);border:none;cursor:pointer;font-size:.88rem;font-weight:600;transition:all var(--transition);display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 4px 12px rgba(124,92,252,.35)}
.btn-primary:hover{background:var(--accent2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,92,252,.5)}
.btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
.btn-secondary:hover{background:var(--border)}
.btn-danger{background:var(--danger);color:#fff}.btn-danger:hover{opacity:.9}
.btn-sm{padding:6px 12px;font-size:.8rem}
.search-bar{display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:0 16px;transition:all var(--transition);flex:1;max-width:360px}
.search-bar:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,92,252,.15)}
.search-bar input{background:none;border:none;color:var(--text);padding:12px 0;font-size:.9rem;width:100%;outline:none}\r
.search-bar input::placeholder{color:var(--text2)}
.search-icon{color:var(--text2);font-size:1.1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:all var(--transition);position:relative;overflow:hidden}
.card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:var(--shadow)}
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--cat-color,#7c5cfc)}
/* card::before background color set via inline style from CATEGORIES config */
.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
.card-title{font-weight:600;font-size:1rem;word-break:break-word;flex:1;margin-right:8px}
/* card-category colors set via inline style from CATEGORIES config */
.card-category{font-size:.7rem;padding:3px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;white-space:nowrap}
.card-preview{color:var(--text2);font-size:.85rem;line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card-footer{display:flex;align-items:center;justify-content:space-between;font-size:.75rem;color:var(--text2)}
.card-actions{display:flex;gap:6px}
.card-icon-btn{width:32px;height:32px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--transition);font-size:.85rem}
.card-icon-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.card-icon-btn.danger:hover{background:var(--danger);border-color:var(--danger)}
.masonry{columns:4 240px;column-gap:20px}
.masonry .sticky-card{break-inside:avoid;margin-bottom:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;transition:all var(--transition);position:relative}
.masonry .sticky-card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.masonry .sticky-card::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:var(--radius) var(--radius) 0 0}
.sticky-title{font-weight:700;font-size:1.05rem;margin-bottom:10px;color:var(--accent2)}
.sticky-fields{display:flex;flex-direction:column;gap:6px}
.sticky-field{font-size:.82rem;color:var(--text2)}.sticky-field strong{color:var(--text);margin-right:4px}
.sticky-actions{display:flex;gap:6px;margin-top:14px;justify-content:flex-end}
.sticky-sensitive{color:var(--warning);font-size:.7rem;margin-top:8px;display:flex;align-items:center;gap:4px}\r
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px;width:90%;max-width:560px;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal h2{font-size:1.3rem;margin-bottom:24px;color:var(--text)}
.form-group{margin-bottom:18px}
.form-group label{display:block;font-size:.82rem;color:var(--text2);margin-bottom:6px;font-weight:600}
.form-group input,.form-group textarea,.form-group select{width:100%;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:.9rem;outline:none;transition:border-color var(--transition);font-family:inherit}
.form-group input:focus,.form-group textarea:focus,.form-group select:focus{border-color:var(--accent)}
.form-group textarea{resize:vertical;min-height:100px}
.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px}
.file-drop{border:2px dashed var(--border);border-radius:var(--radius);padding:32px;text-align:center;cursor:pointer;transition:all var(--transition);color:var(--text2)}
.file-drop:hover,.file-drop.drag{border-color:var(--accent);background:rgba(124,92,252,.05)}
.file-drop .icon{font-size:2rem;margin-bottom:8px}.file-drop p{font-size:.85rem}
.file-preview{display:flex;align-items:center;gap:10px;margin-top:10px;padding:10px;background:var(--surface2);border-radius:var(--radius-sm)}
.file-preview img{width:40px;height:40px;object-fit:cover;border-radius:4px}
.file-preview .name{font-size:.82rem;color:var(--text);word-break:break-all}
.file-preview .size{font-size:.72rem;color:var(--text2)}
.file-preview .remove{color:var(--danger);cursor:pointer;margin-left:auto;font-size:1.2rem}
.pw-field{position:relative}.pw-field input{padding-right:40px}
.pw-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text2);cursor:pointer;font-size:1rem;padding:4px}
.pw-toggle:hover{color:var(--text)}
.toast-container{position:fixed;top:20px;right:20px;z-index:300;display:flex;flex-direction:column;gap:8px}
.toast{padding:12px 20px;border-radius:var(--radius-sm);font-size:.85rem;font-weight:500;animation:slideIn .3s ease;box-shadow:var(--shadow);max-width:360px}
.toast.success{background:#064e3b;color:#6ee7b7;border:1px solid #065f46}
.toast.error{background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
.empty{text-align:center;padding:60px 20px;color:var(--text2)}
.empty .icon{font-size:4rem;margin-bottom:16px;opacity:.5}
.empty h3{font-size:1.2rem;margin-bottom:8px;color:var(--text)}
.empty p{font-size:.9rem;margin-bottom:20px}
.detail-back{color:var(--text2);cursor:pointer;font-size:.9rem;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px}
.detail-back:hover{color:var(--text)}
.detail-content{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.detail-content pre{white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:.9rem;line-height:1.7;color:var(--text)}
.detail-content img{max-width:100%;border-radius:var(--radius-sm)}
.detail-fields{display:flex;flex-direction:column;gap:12px}
.detail-field{display:flex;gap:8px;font-size:.9rem}
.detail-field .label{color:var(--text2);min-width:70px}
.detail-field .value{color:var(--text);word-break:break-all}
.detail-field .value.mono{font-family:"Fira Code","Consolas",monospace;background:var(--surface2);padding:4px 10px;border-radius:var(--radius-sm)}
.loading{display:flex;align-items:center;justify-content:center;padding:40px}
.spinner{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:250;display:flex;align-items:center;justify-content:center}
.confirm-dialog{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;max-width:400px;text-align:center}
.confirm-dialog h3{margin-bottom:12px;font-size:1.1rem}
.confirm-dialog p{color:var(--text2);font-size:.9rem;margin-bottom:20px}
.confirm-actions{display:flex;gap:10px;justify-content:center}
@media(max-width:768px){.sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.main{margin-left:0;padding:20px}.header-title{font-size:1.4rem}.masonry{columns:2 180px}.menu-btn{display:flex!important}}
.menu-btn{display:none;position:fixed;top:16px;left:16px;z-index:110;width:40px;height:40px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:1.2rem;cursor:pointer;align-items:center;justify-content:center}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:var(--text2)}\r
\r
\r
\r
\r
\r

/* Uploading toast */
.toast-info{background:var(--primary);color:#fff}
.toast-spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<!-- \u767B\u5F55\u9875\u9762 -->
<div id="loginScreen" class="login-screen">
  <div class="login-card">
    <div class="login-logo">\u2601\uFE0F</div>
    <h1>\u4E2A\u4EBA\u4E91\u5B58\u50A8</h1>
    <p class="login-sub">\u5B89\u5168\u767B\u5F55\u4EE5\u8BBF\u95EE\u4F60\u7684\u6570\u636E</p>
    <div class="form-group">
      <label>\u7528\u6237\u540D</label>
      <input type="text" id="loginUser" placeholder="\u8BF7\u8F93\u5165\u7528\u6237\u540D" autocomplete="username">
    </div>
    <div class="form-group">
      <label>\u5BC6\u7801</label>
      <div class="pw-field">
        <input type="password" id="loginPass" placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801" autocomplete="current-password">
        <button class="pw-toggle" onclick="toggleLoginPw()">\u{1F441}\uFE0F</button>
      </div>
    </div>
    <div class="login-error" id="loginError"></div>
    <button class="btn btn-primary" onclick="doLogin()" style="width:100%;justify-content:center;padding:14px">\u{1F510} \u767B\u5F55</button>
  </div>
</div>

<!-- \u4E3B\u5E94\u7528\uFF08\u521D\u59CB\u9690\u85CF\uFF09 -->
<div class="app" id="mainApp" style="display:none">
  <button class="menu-btn" onclick="toggleSidebar()">\u2630</button>
  <aside class="sidebar" id="sidebar">
    <!-- \u4FA7\u8FB9\u680F\u7531 JS \u52A8\u6001\u751F\u6210 -->
  </aside>
  <main class="main" id="main">
    <div class="header">
      <h1 class="header-title" id="pageTitle">\u{1F4CB} \u5168\u90E8\u9879\u76EE</h1>
      <div class="header-actions">
        <div class="search-bar">
          <span class="search-icon">\u{1F50D}</span>
          <input type="text" placeholder="\u641C\u7D22..." id="searchInput" oninput="filterItems()">
        </div>
        <button class="btn btn-primary" onclick="openCreateModal()">\uFF0B \u65B0\u5EFA</button>
        <button class="btn btn-secondary" onclick="openSettings()" title="\u8BBE\u7F6E">\u2699\uFE0F</button>
      </div>
    </div>
    <div class="stats-bar" id="statsBar" style="display:none">
      <div class="stats-header"><h3>\u{1F4CA} \u5B58\u50A8\u5360\u7528</h3><span class="stats-total" id="statsTotal"></span></div>
      <div class="stats-progress" id="statsProgress"></div>
      <div class="stats-legend" id="statsLegend"></div>
    </div>
    <div id="contentArea">
      <div class="loading"><div class="spinner"></div></div>
    </div>
  </main>
</div>

<div id="modalContainer"></div>
<div class="toast-container" id="toastContainer"></div>
<script>// ============================================================\r
// \u{1F4CC} \u5206\u7C7B\u914D\u7F6E \u2014\u2014 \u65B0\u589E\u7C7B\u578B\u53EA\u9700\u5728\u8FD9\u91CC\u52A0\u4E00\u884C\r
// ============================================================\r
const CATEGORIES = {\r
  images:    { id:"images",    label:"\u56FE\u7247",   icon:"\u{1F5BC}\uFE0F", color:"#ec4899", hasFile:true,  pageIcon:"\u{1F5BC}\uFE0F", pageLabel:"\u56FE\u7247" },\r
  novels:    { id:"novels",    label:"\u5C0F\u8BF4",   icon:"\u{1F4D6}", color:"#f59e0b", hasFile:true,  pageIcon:"\u{1F4D6}", pageLabel:"\u5C0F\u8BF4" },\r
  documents: { id:"documents", label:"\u6587\u6863",   icon:"\u{1F4C4}", color:"#10b981", hasFile:true,  pageIcon:"\u{1F4C4}", pageLabel:"\u6587\u6863" },\r
  stickies:  { id:"stickies",  label:"\u4FBF\u5229\u8D34", icon:"\u{1F4CC}", color:"#8b5cf6", hasFile:false, pageIcon:"\u{1F4CC}", pageLabel:"\u4FBF\u5229\u8D34", isSticky:true },\r
};\r
const DEFAULT_CATEGORY = "documents";\r
const CATEGORY_LIST = Object.values(CATEGORIES);\r
const PAGE_TITLES = { all: "\u{1F4CB} \u5168\u90E8\u9879\u76EE" };\r
const EMPTY_ICONS = { all: "\u{1F4ED}" };\r
CATEGORY_LIST.forEach(c => {\r
  PAGE_TITLES[c.id] = c.pageIcon + " " + c.pageLabel;\r
  EMPTY_ICONS[c.id] = c.icon;\r
});\r
const API="/api";\r
let AUTH_TOKEN=localStorage.getItem("auth_token")||"";\r
let BLOB_CONFIG=null;\r
async function getBlobConfig(){if(BLOB_CONFIG)return BLOB_CONFIG;try{const r=await apiFetch("/blob-config");if(r.ok){BLOB_CONFIG=await r.json()}return BLOB_CONFIG}catch(e){return null}}\r
let currentCategory="all",allItems=[],currentDetailId=null;\r
\r
// ============================================================\r
// \u{1F510} \u8BA4\u8BC1\r
// ============================================================\r
function setToken(token){AUTH_TOKEN=token;localStorage.setItem("auth_token",token)}\r
function clearToken(){AUTH_TOKEN="";localStorage.removeItem("auth_token")}\r
async function apiFetch(path,options={}){\r
  const headers={...(options.headers||{})};\r
  if(AUTH_TOKEN)headers["Authorization"]="Bearer "+AUTH_TOKEN;\r
  return fetch(API+path,{...options,headers});\r
}\r
async function doLogin(){\r
  const user=document.getElementById("loginUser").value.trim();\r
  const pass=document.getElementById("loginPass").value;\r
  const errEl=document.getElementById("loginError");\r
  if(!user||!pass){errEl.textContent="\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801";return}\r
  try{\r
    const res=await fetch(API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:user,password:pass})});\r
    const data=await res.json();\r
    if(!res.ok){errEl.textContent=data.error||"\u767B\u5F55\u5931\u8D25";return}\r
    setToken(data.token);\r
    if(data.username)localStorage.setItem("auth_username",data.username);\r
    errEl.textContent="";\r
    showMainApp();\r
  }catch(e){errEl.textContent="\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5"}\r
}\r
function toggleLoginPw(){const i=document.getElementById("loginPass");i.type=i.type==="password"?"text":"password"}\r
async function checkAuth(){if(!AUTH_TOKEN)return false;try{const r=await apiFetch("/auth/check");const d=await r.json();return d.valid===true}catch(e){return false}}\r
async function logout(){try{await apiFetch("/auth/logout",{method:"POST"})}catch(e){}clearToken();closeModal();document.getElementById("mainApp").style.display="none";document.getElementById("loginScreen").style.display="flex"}\r
function showMainApp(){document.getElementById("loginScreen").style.display="none";document.getElementById("mainApp").style.display="flex";buildSidebar();setCategory("all");loadItems()}\r
document.addEventListener("keydown",function(e){const ls=document.getElementById("loginScreen");if(ls&&ls.style.display!=="none"&&e.key==="Enter")doLogin()});\r
\r
// ============================================================\r
// \u2699\uFE0F \u8BBE\u7F6E\r
// ============================================================\r
function openSettings(){\r
  const username=localStorage.getItem("auth_username")||"\u672A\u77E5";\r
  document.getElementById("modalContainer").innerHTML=\r
    '<div class="modal"><h2>\u2699\uFE0F \u8D26\u6237\u8BBE\u7F6E</h2>'+\r
    '<h3>\u5F53\u524D\u8D26\u6237</h3><p style="padding:8px 0;color:var(--text2)">\u7528\u6237\u540D: <strong>'+esc(username)+'</strong></p>'+\r
    '<h3>\u4FEE\u6539\u767B\u5F55\u51ED\u8BC1</h3>'+\r
    '<div class="form-group"><label>\u65B0\u7528\u6237\u540D</label><input type="text" id="settingsNewUser" placeholder="\u7559\u7A7A\u4E0D\u4FEE\u6539"></div>'+\r
    '<div class="form-group"><label>\u5F53\u524D\u5BC6\u7801 *</label><input type="password" id="settingsCurPass" placeholder="\u8BF7\u8F93\u5165\u5F53\u524D\u5BC6\u7801"></div>'+\r
    '<div class="form-group"><label>\u65B0\u5BC6\u7801</label><input type="password" id="settingsNewPass" placeholder="\u7559\u7A7A\u4E0D\u4FEE\u6539"></div>'+\r
    '<div id="settingsError" style="color:var(--danger);margin-bottom:8px"></div>'+\r
    '<button class="btn btn-primary" onclick="changeCredentials()">\u{1F4BE} \u4FDD\u5B58\u4FEE\u6539</button>'+\r
    '<hr style="margin:16px 0;border-color:var(--border)"><h3>\u9000\u51FA\u767B\u5F55</h3>'+\r
    '<button class="btn btn-danger" onclick="logout()">\u{1F6AA} \u9000\u51FA\u767B\u5F55</button>'+\r
    '<div style="margin-top:16px"><button class="btn btn-secondary" onclick="closeModal()">\u5173\u95ED</button></div></div>';\r
}\r
async function changeCredentials(){\r
  const errEl=document.getElementById("settingsError");\r
  const newUser=document.getElementById("settingsNewUser").value.trim();\r
  const curPass=document.getElementById("settingsCurPass").value;\r
  const newPass=document.getElementById("settingsNewPass").value;\r
  if(!curPass){errEl.textContent="\u8BF7\u8F93\u5165\u5F53\u524D\u5BC6\u7801";return}\r
  if(!newUser&&!newPass){errEl.textContent="\u8BF7\u81F3\u5C11\u4FEE\u6539\u7528\u6237\u540D\u6216\u5BC6\u7801";return}\r
  try{\r
    const body={currentPassword:curPass};if(newUser)body.newUsername=newUser;if(newPass)body.newPassword=newPass;\r
    const res=await apiFetch("/auth/change",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});\r
    const data=await res.json();\r
    if(!res.ok){errEl.textContent=data.error||"\u4FEE\u6539\u5931\u8D25";return}\r
    toast("\u51ED\u8BC1\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u7262\u8BB0\u65B0\u5BC6\u7801 \u2728","success");\r
    if(data.username)localStorage.setItem("auth_username",data.username);\r
    setTimeout(()=>closeModal(),1000);\r
  }catch(e){errEl.textContent="\u7F51\u7EDC\u9519\u8BEF"}\r
}\r
\r
// ============================================================\r
// \u{1F4C2} \u4FA7\u8FB9\u680F\r
// ============================================================\r
function buildSidebar(){\r
  const sidebar=document.getElementById("sidebar");\r
  let html='<div class="sidebar-logo">\u2601\uFE0F <span>\u4E2A\u4EBA\u4E91\u5B58\u50A8</span></div>';\r
  html+='<div class="nav-group"><div class="nav-label">\u{1F4C2} \u5206\u7C7B\u6D4F\u89C8</div>';\r
  html+='<button class="nav-item" onclick="setCategory(\\'all\\')" data-cat="all">\u{1F4CB} \u5168\u90E8 <span class="nav-count" id="count-all">0</span></button>';\r
  CATEGORY_LIST.forEach(c=>{html+='<button class="nav-item" onclick="setCategory(\\''+c.id+'\\')" data-cat="'+c.id+'">'+c.icon+' '+c.label+' <span class="nav-count" id="count-'+c.id+'">0</span></button>'});\r
  html+='</div><div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border)">';\r
  html+='<button class="nav-item" onclick="openSettings()">\u2699\uFE0F \u8BBE\u7F6E</button>';\r
  html+='<button class="nav-item" onclick="logout()" style="color:var(--danger)">\u{1F6AA} \u9000\u51FA</button></div>';\r
  sidebar.innerHTML=html;\r
}\r
function setCategory(cat){\r
  currentCategory=cat;\r
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.remove("active"));\r
  const navItem=document.querySelector(".nav-item[data-cat='"+cat+"']");if(navItem)navItem.classList.add("active");\r
  loadItems();\r
}\r
async function updateCounts(){\r
  try{const res=await apiFetch("/items?counts=1");if(res.ok){const c=await res.json();Object.entries(c).forEach(([k,v])=>{const el=document.getElementById("count-"+k);if(el)el.textContent=v})}}catch(e){}\r
}\r
\r
// ============================================================\r
// \u{1F4CB} \u5217\u8868 & \u7EDF\u8BA1\r
// ============================================================\r
async function loadItems(){\r
  const area=document.getElementById("contentArea");area.innerHTML='<div class="loading"><div class="spinner"></div></div>';\r
  try{\r
    const url=currentCategory==="all"?"/items":"/items?category="+currentCategory;\r
    const res=await apiFetch(url);if(!res.ok)throw new Error("\u52A0\u8F7D\u5931\u8D25");\r
    allItems=await res.json();updateCounts();loadStats();renderItems(allItems);\r
  }catch(e){area.innerHTML='<div class="empty"><div class="icon">\u26A0\uFE0F</div><h3>\u52A0\u8F7D\u5931\u8D25</h3><p>'+esc(e.message)+'</p></div>'}\r
}\r
async function loadStats(){\r
  try{const res=await apiFetch("/stats");const stats=await res.json();renderStats(stats)}catch(e){}\r
}\r
function renderStats(stats){\r
  const bar=document.getElementById("statsBar");if(!stats.totalItems){bar.style.display="none";return}\r
  bar.style.display="block";\r
  document.getElementById("statsTotal").innerHTML='\u5171 <strong>'+stats.totalItems+'</strong> \u9879 \xB7 <strong>'+formatSize(stats.totalSize)+'</strong>';\r
  const progress=document.getElementById("statsProgress");let html="";\r
  CATEGORY_LIST.forEach(c=>{const cs=stats.categories[c.id];if(cs&&cs.size>0){const pct=(cs.size/stats.totalSize*100).toFixed(1);html+='<div class="stats-segment" style="width:'+pct+'%;background:'+c.color+'" title="'+c.label+': '+formatSize(cs.size)+' ('+cs.count+'\u9879)"></div>'}});\r
  progress.innerHTML=html||'<div class="stats-empty">\u6682\u65E0\u6570\u636E</div>';\r
  const legend=document.getElementById("statsLegend");\r
  legend.innerHTML=CATEGORY_LIST.map(c=>{const cs=stats.categories[c.id];const s=cs?cs.size:0;const n=cs?cs.count:0;return '<div class="stats-legend-item"><span class="stats-legend-dot" style="background:'+c.color+'"></span>'+c.icon+' '+c.label+': <strong>'+formatSize(s)+'</strong> ('+n+'\u9879)</div>'}).join("");\r
}\r
function renderItems(items){\r
  const area=document.getElementById("contentArea");\r
  if(!items.length){area.innerHTML='<div class="empty"><div class="icon">'+(EMPTY_ICONS[currentCategory]||"\u{1F4ED}")+'</div><h3>\u7A7A\u7A7A\u5982\u4E5F</h3><p>\u70B9\u51FB"\u65B0\u5EFA"\u6309\u94AE\u6DFB\u52A0\u5185\u5BB9\u5427 \u2728</p></div>';return}\r
  area.innerHTML='<div class="grid">'+items.map(item=>{\r
    const cat=CATEGORIES[item.category];const label=cat?cat.label:item.category;const color=cat?cat.color:"#7c5cfc";\r
    let cardBody="";\r
    if(item.hasFile){const isImg=item.fileType&&item.fileType.startsWith("image/");cardBody='<div class="card-file-icon">'+(isImg?"\u{1F5BC}\uFE0F":"\u{1F4C1}")+'</div><div class="card-file-meta"><span class="card-file-name">'+esc(item.fileName||"\u672A\u547D\u540D\u6587\u4EF6")+'</span><span class="card-file-size">'+formatSize(item.fileSize||0)+'</span></div>'}\r
    else{cardBody='<div class="card-preview" style="color:var(--text2);font-style:italic">\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5 \u2192</div>'}\r
    return '<div class="card" style="--cat-color:'+color+'" onclick="viewDetail(\\''+item.id+'\\')">'+cardBody+'<div class="card-header"><span class="card-title">'+esc(item.title)+'</span><span class="card-category" style="background:'+color+'22;color:'+color+'">'+label+'</span></div><div class="card-footer"><span>'+fmtDate(item.updatedAt)+'</span><div class="card-actions" onclick="event.stopPropagation()"><button class="card-icon-btn" onclick="openEditModal(\\''+item.id+'\\')" title="\u7F16\u8F91">\u270F\uFE0F</button><button class="card-icon-btn" onclick="downloadItem(\\''+item.id+'\\')" title="\u4E0B\u8F7D">\u2B07\uFE0F</button><button class="card-icon-btn danger" onclick="confirmDelete(\\''+item.id+'\\')" title="\u5220\u9664">\u{1F5D1}\uFE0F</button></div></div></div>';\r
  }).join("")+"</div>";\r
}\r
\r
// ============================================================\r
// \u{1F50D} \u8BE6\u60C5 - \u70B9\u51FB\u65F6\u61D2\u52A0\u8F7D\u5185\u5BB9\r
// ============================================================\r
async function viewDetail(id){\r
  let item=allItems.find(i=>i.id===id);if(!item)return;\r
  if(!item._fullLoaded){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();item=Object.assign(item,full,{_fullLoaded:true});const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)allItems[idx]=item}}catch(e){}}\r
  currentDetailId=id;const cat=CATEGORIES[item.category];const label=cat?cat.label:item.category;const color=cat?cat.color:"#7c5cfc";const area=document.getElementById("contentArea");\r
  let contentHtml="";\r
  if(item.hasFile&&item.fileType&&item.fileType.startsWith("image/")){\r
    contentHtml='<img src="/api/items/'+item.id+'/download?t='+AUTH_TOKEN+'" style="max-width:100%;border-radius:var(--radius-sm)" onerror="this.outerHTML=\\'<div class=lazy-placeholder><div class=lazy-icon>\u26A0\uFE0F</div><p>\u52A0\u8F7D\u5931\u8D25</p></div>\\'">';\r
  }else if(item.hasFile){\r
    contentHtml='<div class="detail-file-info"><div class="file-type-icon">\u{1F4C4}</div><div><strong>'+esc(item.fileName||"\u6587\u4EF6")+'</strong></div><div class="text2">'+formatSize(item.fileSize||0)+'</div></div>';\r
  }else if(item.category==="stickies"&&item.content){\r
    try{const fields=JSON.parse(item.content);contentHtml='<div class="detail-fields">'+Object.entries(fields).map(([k,v])=>{const isSensitive=k.includes("\u5BC6\u7801")||k.toLowerCase().includes("password")||k.includes("pass");return '<div class="detail-field"><span class="label">'+esc(k)+'</span><span class="value '+(isSensitive?"mono":"")+'">'+(isSensitive?'\u{1F512} <em style="color:var(--warning)">\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF (\u70B9\u51FB\u7F16\u8F91\u67E5\u770B)</em>':esc(String(v)))+'</span></div>'}).join("")+'</div>'}catch(e){contentHtml='<pre>'+esc(item.content)+'</pre>'}\r
  }else{contentHtml='<pre>'+(item.content?esc(item.content):"\u65E0\u5185\u5BB9")+'</pre>'}\r
  area.innerHTML='<div class="detail-back" onclick="currentDetailId=null;renderItems(allItems)">\u2190 \u8FD4\u56DE\u5217\u8868</div><div class="header"><h1 class="header-title">'+esc(item.title)+' <span class="card-category" style="background:'+color+'22;color:'+color+'">'+label+'</span></h1><div class="header-actions"><button class="btn btn-secondary" onclick="openEditModal(\\''+item.id+'\\')">\u270F\uFE0F \u7F16\u8F91</button><button class="btn btn-secondary" onclick="downloadItem(\\''+item.id+'\\')">\u2B07\uFE0F \u4E0B\u8F7D</button><button class="btn btn-danger" onclick="confirmDelete(\\''+item.id+'\\')">\u{1F5D1}\uFE0F \u5220\u9664</button></div></div><div class="detail-content">'+contentHtml+'</div>';\r
}\r
\r
// ============================================================\r
// \u2B07\uFE0F \u4E0B\u8F7D - \u6587\u4EF6\u7528\u539F\u751F<a>\u6807\u7B7E(\u5FEB), \u6587\u672C\u7528blob\r
// ============================================================\r
async function downloadItem(id){\r
  const item=allItems.find(i=>i.id===id);if(!item)return;\r
  if(item.hasFile){\r
    toast("\u4E0B\u8F7D\u5F00\u59CB\uFF01","success");const a=document.createElement("a");\r
    a.href="/api/items/"+id+"/download?t="+AUTH_TOKEN;a.download=item.fileName||item.title||"download";\r
    document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),100);\r
  }else{\r
    if(!item.content){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();if(full.content)item.content=full.content}}catch(e){}}\r
    if(!item.content){toast("\u8BF7\u5148\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5","error");return}\r
    let text=item.content||"";if(item.category==="stickies"){try{const f=JSON.parse(text);text=Object.entries(f).map(([k,v])=>k+": "+v).join("\\n")}catch(e){}}\r
    const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);\r
    const a=document.createElement("a");a.href=url;a.download=(item.title||"download")+".txt";\r
    document.body.appendChild(a);a.click();setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},1000);\r
    toast("\u4E0B\u8F7D\u5F00\u59CB\uFF01","success");\r
  }\r
}\r
\r
// ============================================================\r
// \u2795 \u521B\u5EFA/\u7F16\u8F91\u6A21\u6001\u6846\r
// ============================================================\r
function openCreateModal(){showModal("\u65B0\u5EFA\u9879\u76EE","create",null);const cat=currentCategory==="all"?DEFAULT_CATEGORY:currentCategory;document.getElementById("modal-category").value=cat;onCategoryChange()}\r
async function openEditModal(id){\r
  let item=allItems.find(i=>i.id===id);if(!item)return;\r
  if(!item._fullLoaded){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();item=Object.assign(item,full,{_fullLoaded:true});const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)allItems[idx]=item}}catch(e){}}\r
  showModal("\u7F16\u8F91\u9879\u76EE","edit",item);\r
}\r
function showModal(title,mode,item){\r
  const isSticky=mode==="create"?currentCategory==="stickies":(item&&item.category==="stickies");\r
  const selCat=(item&&item.category)||(currentCategory==="all"?DEFAULT_CATEGORY:currentCategory);\r
  const catOptions=CATEGORY_LIST.map(c=>'<option value="'+c.id+'"'+(selCat===c.id?" selected":"")+'>'+c.icon+' '+c.label+'</option>').join("");\r
  const container=document.getElementById("modalContainer");\r
  container.innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><h2>'+title+'</h2>'+\r
    '<div class="form-group"><label>\u5206\u7C7B</label><select id="modal-category" onchange="onCategoryChange()">'+catOptions+'</select></div>'+\r
    '<div class="form-group"><label>\u6807\u9898 *</label><input type="text" id="modal-title" value="'+escAttr(item?item.title:"")+'" placeholder="\u8F93\u5165\u6807\u9898"></div>'+\r
    '<div id="stickyFields">'+(isSticky?getStickyFieldsHtml(item):'<div class="form-group"><label>\u5185\u5BB9</label><textarea id="modal-content" placeholder="\u8F93\u5165\u5185\u5BB9...">'+escAttr(item?item.content||"":"")+'</textarea></div>')+'</div>'+\r
    '<div id="fileUploadArea">'+(isSticky?"":getFileUploadHtml(item))+'</div>'+\r
    '<div class="form-actions"><button class="btn btn-secondary" onclick="closeModal()">\u53D6\u6D88</button>'+\r
    '<button class="btn btn-primary" onclick="submitForm(\\''+mode+'\\''+(item?',\\''+item.id+'\\'':"")+')">'+(mode==="create"?"\u521B\u5EFA":"\u4FDD\u5B58")+'</button></div></div></div>';\r
}\r
function getStickyFieldsHtml(item){\r
  let fields={};if(item&&item.content){try{fields=JSON.parse(item.content)}catch(e){}}\r
  if(Object.keys(fields).length===0)fields={"\u8D26\u53F7/\u5E73\u53F0":"","\u7528\u6237\u540D":"","\u5BC6\u7801":"","\u5907\u6CE8":""};\r
  return '<div id="stickyFieldsContainer">'+Object.entries(fields).map(([k,v],i)=>\r
    '<div class="form-group sticky-field-row" style="display:flex;gap:8px;align-items:center"><input type="text" value="'+escAttr(k)+'" placeholder="\u5B57\u6BB5\u540D" style="flex:1" class="sticky-key"><div class="pw-field" style="flex:1"><input type="password" value="'+escAttr(v)+'" placeholder="\u503C" class="sticky-val"><button class="pw-toggle" onclick="togglePw(this)">\u{1F441}\uFE0F</button></div><button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">\u2715</button></div>'\r
  ).join("")+'</div><button class="btn btn-sm btn-secondary" onclick="addStickyField()" style="margin-top:8px">\uFF0B \u6DFB\u52A0\u5B57\u6BB5</button>';\r
}\r
function addStickyField(){const c=document.getElementById("stickyFieldsContainer");const r=document.createElement("div");r.className="form-group sticky-field-row";r.style.cssText="display:flex;gap:8px;align-items:center";r.innerHTML='<input type="text" placeholder="\u5B57\u6BB5\u540D" style="flex:1" class="sticky-key"><div class="pw-field" style="flex:1"><input type="password" placeholder="\u503C" class="sticky-val"><button class="pw-toggle" onclick="togglePw(this)">\u{1F441}\uFE0F</button></div><button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">\u2715</button>';c.appendChild(r)}\r
function togglePw(btn){const i=btn.parentElement.querySelector("input");i.type=i.type==="password"?"text":"password";btn.textContent=i.type==="password"?"\u{1F441}\uFE0F":"\u{1F648}"}\r
function onCategoryChange(){const cat=document.getElementById("modal-category").value;const cfg=CATEGORIES[cat];const sd=document.getElementById("stickyFields");const fd=document.getElementById("fileUploadArea");if(cfg&&cfg.isSticky){sd.innerHTML=getStickyFieldsHtml(null);fd.innerHTML=""}else{sd.innerHTML='<div class="form-group"><label>\u5185\u5BB9</label><textarea id="modal-content" placeholder="\u8F93\u5165\u5185\u5BB9..."></textarea></div>';fd.innerHTML=getFileUploadHtml(null)}}\r
function getFileUploadHtml(item){const hasFile=item&&item.fileData;return '<div class="form-group"><label>\u6587\u4EF6\u9644\u4EF6</label>'+(hasFile?'<div class="file-preview"><span>\u{1F4C4}</span><span class="name">'+esc(item.fileName)+'</span><span class="size">'+formatSize(item.fileSize||0)+'</span></div>':'<div class="file-drop" onclick="document.getElementById(\\'fileInput\\').click()" id="fileDrop"><div class="icon">\u{1F4C1}</div><p>\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20</p></div>')+'<input type="file" id="fileInput" style="display:none" onchange="handleFileSelect(event)"></div>';}\r
let selectedFile=null;\r
function handleFileSelect(e){const file=e.target.files[0];if(!file)return;if(file.size>20*1024*1024){toast("\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC75MB","error");return}selectedFile=file;const reader=new FileReader();reader.onload=function(ev){const drop=document.getElementById("fileDrop");if(drop){const isImg=file.type.startsWith("image/");drop.innerHTML='<div class="file-preview">'+(isImg?'<img src="'+ev.target.result+'">':'<span>'+getFileIcon(file.type)+'</span>')+'<span class="name">'+esc(file.name)+'</span><span class="size">'+formatSize(file.size)+'</span><span class="remove" onclick="removeFile()">\u2715</span></div>'}};reader.readAsDataURL(file)}\r
function getFileIcon(t){if(!t)return"\u{1F4C4}";if(t.startsWith("image/"))return"\u{1F5BC}\uFE0F";if(t.startsWith("video/"))return"\u{1F3AC}";if(t.startsWith("audio/"))return"\u{1F3B5}";if(t.startsWith("text/"))return"\u{1F4DD}";if(t.includes("pdf"))return"\u{1F4D5}";if(t.includes("zip")||t.includes("rar")||t.includes("gz"))return"\u{1F4E6}";if(t.includes("word")||t.includes("document"))return"\u{1F4C4}";if(t.includes("excel")||t.includes("sheet"))return"\u{1F4CA}";return"\u{1F4C1}"}\r
function removeFile(){selectedFile=null;document.getElementById("uploadProgress").style.display="none";const drop=document.getElementById("fileDrop");if(drop)drop.innerHTML='<div class="icon">\u{1F4C1}</div><p>\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20</p>'}\r
document.addEventListener("dragover",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.add("drag")});\r
document.addEventListener("dragleave",e=>{const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag")});\r
document.addEventListener("drop",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag");if(e.dataTransfer.files.length)handleFileSelect({target:{files:e.dataTransfer.files}})});\r
\r
// ============================================================\r
// \u{1F4E4} \u63D0\u4EA4\u8868\u5355 - \u975E\u963B\u585E\u4E0A\u4F20, \u76F4\u63A5\u63D2\u5165\u5217\u8868\r
// ============================================================\r
\r
// Direct upload to Netlify Blobs (bypasses 6MB function limit)\r
async function uploadToBlobs(file, onProgress){\r
  const cfg=await getBlobConfig();\r
  if(!cfg||!cfg.token){throw new Error("\u65E0\u6CD5\u83B7\u53D6\u4E0A\u4F20\u914D\u7F6E")}\r
  const key="file:"+Date.now()+"_"+Math.random().toString(36).slice(2,8);\r
  const url=(cfg.apiURL||"https://api.netlify.com")+"/api/v1/blobs/"+cfg.siteID+"/personal-cloud/"+encodeURIComponent(key);\r
  return new Promise((resolve,reject)=>{\r
    const xhr=new XMLHttpRequest();\r
    xhr.open("PUT",url);\r
    xhr.setRequestHeader("Authorization","Bearer "+cfg.token);\r
    xhr.setRequestHeader("Content-Type","application/octet-stream");\r
    xhr.upload.onprogress=e=>{if(e.lengthComputable&&onProgress){onProgress(Math.round(e.loaded/e.total*100))}};\r
    xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){resolve({key,fileName:file.name,fileType:file.type,fileSize:file.size})}else{try{reject(new Error(JSON.parse(xhr.responseText).error||"\u4E0A\u4F20\u5931\u8D25"))}catch(e){reject(new Error("\u4E0A\u4F20\u5931\u8D25: "+xhr.status))}}};\r
    xhr.onerror=()=>reject(new Error("\u7F51\u7EDC\u9519\u8BEF"));\r
    xhr.send(file);\r
  });\r
}\r
\r
async function submitForm(mode,id){\r
  const title=document.getElementById("modal-title").value.trim();if(!title){toast("\u8BF7\u8F93\u5165\u6807\u9898","error");return}\r
  const category=document.getElementById("modal-category").value;const cfg=CATEGORIES[category];const isSticky=cfg&&cfg.isSticky;\r
  let stickyData=null,fileContent="";\r
  if(isSticky){const keys=document.querySelectorAll(".sticky-key");const vals=document.querySelectorAll(".sticky-val");const obj={};keys.forEach((k,i)=>{if(k.value.trim())obj[k.value.trim()]=vals[i]?vals[i].value:""});if(Object.keys(obj).length===0){toast("\u8BF7\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u5B57\u6BB5","error");return}stickyData=JSON.stringify(obj)}\r
  else{const ta=document.getElementById("modal-content");fileContent=ta?ta.value:""}\r
  const uploadFile=selectedFile;\r
  const toastId="toast_"+Date.now();showUploadingToast(toastId);closeModal();selectedFile=null;\r
  let res;\r
  try{\r
    if(isSticky){const body={title,content:stickyData,category};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}\r
    else if(uploadFile){try{const blobResult=await uploadToBlobs(uploadFile,pct=>{const el=document.getElementById(toastId);if(el)el.innerHTML='<div class="toast-spinner"></div> \u4E0A\u4F20\u4E2D... '+pct+'%'});const body={title,content:fileContent,category,fileKey:blobResult.key,fileName:blobResult.fileName,fileType:blobResult.fileType,fileSize:blobResult.fileSize};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}catch(directErr){const form=new FormData();form.append("title",title);form.append("content",fileContent);form.append("category",category);form.append("file",uploadFile,uploadFile.name);const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await uploadWithProgress(u,m,form)}}\r
\r
    else{let content=fileContent;const body={title,content,category};if(mode==="edit"){const ex=allItems.find(i=>i.id===id);if(ex){body.fileData=ex.fileData||null;body.fileName=ex.fileName;body.fileType=ex.fileType;body.fileSize=ex.fileSize}}const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}\r
    if(!res.ok){const e=await res.json();throw new Error(e.error||"\u64CD\u4F5C\u5931\u8D25")}\r
    const saved=await res.json();removeToast(toastId);\r
    if(mode==="create"){allItems.unshift(saved)}else{const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)Object.assign(allItems[idx],saved)}\r
    updateCounts();loadStats();renderItems(allItems);toast(mode==="create"?"\u521B\u5EFA\u6210\u529F\uFF01":"\u66F4\u65B0\u6210\u529F\uFF01","success");\r
  }catch(e){removeToast(toastId);toast(e.message,"error")}\r
}\r
function uploadWithProgress(url,method,formData){return new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open(method,"/api"+url);if(AUTH_TOKEN)xhr.setRequestHeader("Authorization","Bearer "+AUTH_TOKEN);xhr.upload.onprogress=e=>{if(e.lengthComputable){const pct=Math.round(e.loaded/e.total*100);const bar=document.getElementById("uploadFill");const txt=document.getElementById("uploadText");if(bar)bar.style.width=pct+"%";if(txt)txt.textContent=pct+"%"}};xhr.onload=()=>{try{const data=JSON.parse(xhr.responseText);resolve({ok:xhr.status>=200&&xhr.status<300,json:()=>Promise.resolve(data),status:xhr.status})}catch(e){resolve({ok:xhr.status>=200&&xhr.status<300,json:()=>Promise.resolve({}),status:xhr.status})}};xhr.onerror=()=>reject(new Error("\u7F51\u7EDC\u9519\u8BEF"));xhr.send(formData)})}\r
function showUploadingToast(id){const c=document.getElementById("toastContainer");const el=document.createElement("div");el.id=id;el.className="toast toast-info";el.innerHTML='<div class="toast-spinner"></div> \u6B63\u5728\u4E0A\u4F20\uFF0C\u8BF7\u7A0D\u5019...';c.appendChild(el)}\r
function removeToast(id){const el=document.getElementById(id);if(el)el.remove()}\r
\r
// ============================================================\r
// \u{1F5D1}\uFE0F \u5220\u9664\r
// ============================================================\r
function confirmDelete(id){const c=document.getElementById("modalContainer");c.innerHTML='<div class="confirm-overlay"><div class="confirm-dialog"><h3>\u786E\u8BA4\u5220\u9664</h3><p>\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\uFF0C\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F</p><div class="confirm-actions"><button class="btn btn-secondary" onclick="closeModal()">\u53D6\u6D88</button><button class="btn btn-danger" onclick="deleteItem(\\''+id+'\\')">\u786E\u8BA4\u5220\u9664</button></div></div></div>'}\r
async function deleteItem(id){try{const res=await apiFetch("/items/"+id,{method:"DELETE"});if(!res.ok)throw new Error("\u5220\u9664\u5931\u8D25");closeModal();allItems=allItems.filter(i=>i.id!==id);updateCounts();loadStats();renderItems(allItems);toast("\u5DF2\u5220\u9664","success")}catch(e){toast(e.message,"error")}}\r
function closeModal(){document.getElementById("modalContainer").innerHTML="";selectedFile=null;const bar=document.getElementById("uploadProgress");if(bar)bar.style.display="none"}\r
\r
// ============================================================\r
// \u{1F527} \u5DE5\u5177\u51FD\u6570\r
// ============================================================\r
function toast(msg,type){const c=document.getElementById("toastContainer");const el=document.createElement("div");el.className="toast "+type;el.textContent=msg;c.appendChild(el);setTimeout(()=>{el.style.opacity="0";el.style.transition="opacity .3s";setTimeout(()=>el.remove(),300)},2500)}\r
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}\r
function escAttr(s){return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}\r
function fmtDate(d){if(!d)return"";return new Date(d).toLocaleDateString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}\r
function formatSize(b){if(!b)return"0 B";const u=["B","KB","MB","GB"];let i=0;while(b>=1024&&i<3){b/=1024;i++}return b.toFixed(1)+" "+u[i]}\r
\r
// ============================================================\r
// \u{1F504} \u81EA\u52A8\u767B\u5F55 - \u5237\u65B0\u540E\u6062\u590D\u4F1A\u8BDD\r
// ============================================================\r
(async function init(){\r
  if(AUTH_TOKEN){const valid=await checkAuth();if(valid){showMainApp();return}}\r
  document.getElementById("loginScreen").style.display="flex";document.getElementById("mainApp").style.display="none";\r
})();\r
<\/script>
</body>
</html>\r
`;

// src/worker.js
var CATEGORIES = ["images", "novels", "documents", "stickies"];
var MAX_FILE_SIZE = 50 * 1024 * 1024;
var DEFAULT_USERNAME = "rsn";
var DEFAULT_PASSWORD = "131420";
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
__name(json, "json");
function error(msg, status = 400) {
  return json({ error: msg }, status);
}
__name(error, "error");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
__name(generateId, "generateId");
function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");
function generateSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateSalt, "generateSalt");
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const km = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const d = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 2e5, hash: "SHA-256" }, km, 256);
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
async function getCredentials(env) {
  let creds = await env.PERSONAL_CLOUD_KV.get("auth:credentials", "json");
  if (!creds) {
    const salt = generateSalt();
    creds = { username: DEFAULT_USERNAME, passwordHash: await hashPassword(DEFAULT_PASSWORD, salt), salt };
    await env.PERSONAL_CLOUD_KV.put("auth:credentials", JSON.stringify(creds));
  }
  return creds;
}
__name(getCredentials, "getCredentials");
async function validateToken(env, token) {
  if (!token) return false;
  const session = await env.PERSONAL_CLOUD_KV.get("auth:token:" + token, "json");
  if (!session || Date.now() > session.expires) return false;
  return true;
}
__name(validateToken, "validateToken");
async function requireAuth(request, env) {
  let token = "";
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) token = auth.slice(7);
  if (!token) {
    const url = new URL(request.url);
    token = url.searchParams.get("t") || "";
  }
  if (!await validateToken(env, token)) return error("\u672A\u6388\u6743\uFF0C\u8BF7\u5148\u767B\u5F55", 401);
  return null;
}
__name(requireAuth, "requireAuth");
function estimateSize(item) {
  let size = item.fileSize || 0;
  if (item.content) size += new TextEncoder().encode(item.content).length;
  return size;
}
__name(estimateSize, "estimateSize");
async function getStorageStats(env) {
  const all = await env.PERSONAL_CLOUD_KV.list({ prefix: "item:" });
  const stats = { totalSize: 0, totalItems: 0, categories: {} };
  CATEGORIES.forEach((c) => stats.categories[c] = { count: 0, size: 0 });
  for (const key of all.keys) {
    const val = await env.PERSONAL_CLOUD_KV.get(key.name, "json");
    if (!val) continue;
    stats.totalItems++;
    stats.totalSize += estimateSize(val);
    if (stats.categories[val.category]) {
      stats.categories[val.category].count++;
      stats.categories[val.category].size += estimateSize(val);
    }
  }
  return stats;
}
__name(getStorageStats, "getStorageStats");
async function listItems(env, category) {
  const prefix = category ? "item:" + category + ":" : "item:";
  const result = await env.PERSONAL_CLOUD_KV.list({ prefix });
  const items = [];
  for (const key of result.keys) {
    const val = await env.PERSONAL_CLOUD_KV.get(key.name, "json");
    if (val) {
      const { content, fileData, ...meta } = val;
      items.push(meta);
    }
  }
  items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return items;
}
__name(listItems, "listItems");
async function getCounts(env) {
  const all = await env.PERSONAL_CLOUD_KV.list({ prefix: "item:" });
  const counts = { all: 0 };
  CATEGORIES.forEach((c) => counts[c] = 0);
  for (const key of all.keys) {
    counts.all++;
    const parts = key.name.split(":");
    if (parts.length >= 2 && counts[parts[1]] !== void 0) counts[parts[1]]++;
  }
  return counts;
}
__name(getCounts, "getCounts");
async function findItem(env, itemId) {
  for (const cat of CATEGORIES) {
    const item = await env.PERSONAL_CLOUD_KV.get("item:" + cat + ":" + itemId, "json");
    if (item) return { item, key: "item:" + cat + ":" + itemId };
  }
  return null;
}
__name(findItem, "findItem");
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
__name(parseFormData, "parseFormData");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization" } });
    }
    if (path === "/" || path === "/index.html") {
      return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (path === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const creds = await getCredentials(env);
        const ih = await hashPassword(body.password || "", creds.salt);
        if (body.username === creds.username && ih === creds.passwordHash) {
          const token = generateToken();
          await env.PERSONAL_CLOUD_KV.put("auth:token:" + token, JSON.stringify({ username: creds.username, createdAt: Date.now(), expires: Date.now() + 864e5 }));
          return json({ token, expires: Date.now() + 864e5, username: creds.username });
        }
        return error("\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF", 401);
      } catch (e) {
        return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF");
      }
    }
    if (path === "/api/auth/check" && request.method === "GET") {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      return json({ valid: await validateToken(env, token) });
    }
    if (path === "/api/auth/change" && request.method === "POST") {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      try {
        const body = await request.json();
        const creds = await getCredentials(env);
        const ih = await hashPassword(body.currentPassword || "", creds.salt);
        if (ih !== creds.passwordHash) return error("\u5F53\u524D\u5BC6\u7801\u9519\u8BEF", 401);
        const ns = generateSalt();
        const nc = { username: body.newUsername || creds.username, passwordHash: await hashPassword(body.newPassword || DEFAULT_PASSWORD, ns), salt: ns };
        await env.PERSONAL_CLOUD_KV.put("auth:credentials", JSON.stringify(nc));
        return json({ success: true, username: nc.username });
      } catch (e) {
        return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF");
      }
    }
    if (path === "/api/auth/logout" && request.method === "POST") {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (token) await env.PERSONAL_CLOUD_KV.delete("auth:token:" + token);
      return json({ success: true });
    }
    if (path === "/api/stats" && request.method === "GET") {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      return json(await getStorageStats(env));
    }
    if ((path === "/api/items" || path === "/api/items/") && request.method === "GET") {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      if (url.searchParams.has("counts")) return json(await getCounts(env));
      return json(await listItems(env, url.searchParams.get("category") || null));
    }
    if ((path === "/api/items" || path === "/api/items/") && request.method === "POST") {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      try {
        const contentType = request.headers.get("Content-Type") || "";
        let title, content, category, fileData = null, fileName = null, fileType = null, fileSize = 0;
        if (contentType.includes("multipart/form-data")) {
          const form = await parseFormData(request);
          title = form.title;
          content = form.content || "";
          category = form.category;
          if (form._file) {
            if (form._file.size > MAX_FILE_SIZE) return error("\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC750MB");
            fileData = await form._file.arrayBuffer();
            fileName = form._file.name;
            fileType = form._file.type;
            fileSize = form._file.size;
          }
        } else {
          const body = await request.json();
          title = body.title;
          content = body.content || "";
          category = body.category;
          if (body.fileData) {
            const comma = body.fileData.indexOf(",");
            if (comma > 0) {
              const b64 = body.fileData.substring(comma + 1);
              fileData = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
              fileName = body.fileName;
              fileType = body.fileType;
              fileSize = body.fileSize;
            }
          }
        }
        if (!title || !category) return error("\u6807\u9898\u548C\u5206\u7C7B\u4E3A\u5FC5\u586B\u9879");
        if (!CATEGORIES.includes(category)) return error("\u65E0\u6548\u7684\u5206\u7C7B");
        const id = generateId();
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const item = { id, title, content, category, fileName: fileName || null, fileType: fileType || null, fileSize: fileSize || 0, hasFile: !!fileData, createdAt: now, updatedAt: now };
        if (fileData) {
          await env.PERSONAL_CLOUD_KV.put("file:" + id, fileData);
        }
        await env.PERSONAL_CLOUD_KV.put("item:" + category + ":" + id, JSON.stringify(item));
        return json(item, 201);
      } catch (e) {
        return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF: " + e.message);
      }
    }
    const dlMatch = path.match(/^\/api\/items\/([a-z0-9]+)\/download$/);
    if (dlMatch && request.method === "GET") {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      const itemId = dlMatch[1];
      const fileData = await env.PERSONAL_CLOUD_KV.get("file:" + itemId, "arrayBuffer");
      if (!fileData) return error("\u6587\u4EF6\u672A\u627E\u5230", 404);
      const found = await findItem(env, itemId);
      const fname = found ? found.item.fileName : "download";
      const ftype = found ? found.item.fileType : "application/octet-stream";
      return new Response(fileData, {
        headers: { "Content-Type": ftype || "application/octet-stream", "Access-Control-Allow-Origin": "*" }
      });
    }
    const match = path.match(/^\/api\/items\/([a-z0-9]+)$/);
    if (match) {
      const ae = await requireAuth(request, env);
      if (ae) return ae;
      const itemId = match[1];
      if (request.method === "GET") {
        const found = await findItem(env, itemId);
        if (found) {
          if (found.item.fileData) delete found.item.fileData;
          return json(found.item);
        }
        return error("\u672A\u627E\u5230", 404);
      }
      if (request.method === "PUT") {
        try {
          const contentType = request.headers.get("Content-Type") || "";
          let title, content, category, fileData = null, fileName = null, fileType = null, fileSize = 0, hasFile;
          if (contentType.includes("multipart/form-data")) {
            const form = await parseFormData(request);
            title = form.title;
            content = form.content;
            category = form.category;
            if (form._file) {
              if (form._file.size > MAX_FILE_SIZE) return error("\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC750MB");
              fileData = await form._file.arrayBuffer();
              fileName = form._file.name;
              fileType = form._file.type;
              fileSize = form._file.size;
              hasFile = true;
            }
          } else {
            const body = await request.json();
            title = body.title;
            content = body.content;
            category = body.category;
            if (body.fileData !== void 0) {
              if (body.fileData) {
                const comma = body.fileData.indexOf(",");
                if (comma > 0) {
                  fileData = Uint8Array.from(atob(body.fileData.substring(comma + 1)), (c) => c.charCodeAt(0)).buffer;
                  fileName = body.fileName;
                  fileType = body.fileType;
                  fileSize = body.fileSize;
                }
                hasFile = true;
              } else {
                hasFile = false;
              }
            }
          }
          const found = await findItem(env, itemId);
          if (!found) return error("\u672A\u627E\u5230", 404);
          const existing = found.item;
          const nc = category && CATEGORIES.includes(category) ? category : existing.category;
          const updated = {
            ...existing,
            title: title !== void 0 ? title : existing.title,
            content: content !== void 0 ? content : existing.content,
            category: nc,
            fileName: fileName !== void 0 ? fileName : existing.fileName,
            fileType: fileType !== void 0 ? fileType : existing.fileType,
            fileSize: fileSize !== void 0 ? fileSize : existing.fileSize,
            hasFile: hasFile !== void 0 ? hasFile : existing.hasFile,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          if (fileData) {
            await env.PERSONAL_CLOUD_KV.put("file:" + itemId, fileData);
          } else if (hasFile === false) {
            await env.PERSONAL_CLOUD_KV.delete("file:" + itemId);
          }
          const nk = "item:" + nc + ":" + itemId;
          if (found.key !== nk) await env.PERSONAL_CLOUD_KV.delete(found.key);
          await env.PERSONAL_CLOUD_KV.put(nk, JSON.stringify(updated));
          return json(updated);
        } catch (e) {
          return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF: " + e.message);
        }
      }
      if (request.method === "DELETE") {
        const found = await findItem(env, itemId);
        if (!found) return error("\u672A\u627E\u5230", 404);
        await env.PERSONAL_CLOUD_KV.delete(found.key);
        await env.PERSONAL_CLOUD_KV.delete("file:" + itemId);
        return json({ success: true });
      }
    }
    return error("Not Found", 404);
  }
};

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-BGVRkf/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-BGVRkf/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
