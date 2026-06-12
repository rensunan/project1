var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/html.js
var HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>\u2601\uFE0F \u4E2A\u4EBA\u4E91\u6570\u636E\u5B58\u50A8</title>
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f0f1a;--surface:#1a1a2e;--surface2:#222240;--border:#2a2a4a;--text:#e0e0f0;--text2:#9090b0;--accent:#7c5cfc;--accent2:#a78bfa;--danger:#f87171;--success:#34d399;--warning:#fbbf24;--info:#60a5fa;--images:#ec4899;--novels:#f59e0b;--documents:#10b981;--stickies:#8b5cf6;--radius:12px;--radius-sm:8px;--shadow:0 4px 24px rgba(0,0,0,.4);--transition:0.25s cubic-bezier(.4,0,.2,1)}
body{font-family:"Inter","Segoe UI",system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;background-image:radial-gradient(ellipse at 20% 20%,#1a1040 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#101040 0%,transparent 50%)}
.app{display:flex;min-height:100vh}
.sidebar{width:260px;background:rgba(26,26,46,.85);backdrop-filter:blur(20px);border-right:1px solid var(--border);padding:24px 16px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform var(--transition)}
.sidebar-logo{font-size:1.4rem;font-weight:700;margin-bottom:32px;display:flex;align-items:center;gap:10px}
.sidebar-logo span{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}\r
.nav-group{margin-bottom:24px}
.nav-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text2);margin-bottom:8px;padding:0 8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition);color:var(--text2);font-size:.9rem;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--surface2);color:var(--text)}
.nav-item.active{background:var(--accent);color:#fff;box-shadow:0 4px 12px rgba(124,92,252,.4)}
.nav-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.nav-dot.images{background:var(--images)}.nav-dot.novels{background:var(--novels)}
.nav-dot.documents{background:var(--documents)}.nav-dot.stickies{background:var(--stickies)}
.nav-count{font-size:.75rem;background:var(--surface2);padding:2px 8px;border-radius:99px;margin-left:auto}
.nav-item.active .nav-count{background:rgba(255,255,255,.2)}
.main{flex:1;margin-left:260px;padding:32px}
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
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px}
.card.images::before{background:var(--images)}.card.novels::before{background:var(--novels)}
.card.documents::before{background:var(--documents)}.card.stickies::before{background:var(--stickies)}
.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
.card-title{font-weight:600;font-size:1rem;word-break:break-word;flex:1;margin-right:8px}
.card-category{font-size:.7rem;padding:3px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;white-space:nowrap}
.card-category.images{background:rgba(236,72,153,.2);color:var(--images)}
.card-category.novels{background:rgba(245,158,11,.2);color:var(--novels)}
.card-category.documents{background:rgba(16,185,129,.2);color:var(--documents)}
.card-category.stickies{background:rgba(139,92,246,.2);color:var(--stickies)}
.card-preview{color:var(--text2);font-size:.85rem;line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card-footer{display:flex;align-items:center;justify-content:space-between;font-size:.75rem;color:var(--text2)}
.card-actions{display:flex;gap:6px}
.card-icon-btn{width:32px;height:32px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface2);color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--transition);font-size:.85rem}
.card-icon-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.card-icon-btn.danger:hover{background:var(--danger);border-color:var(--danger)}\r
.masonry{columns:4 240px;column-gap:20px}
.masonry .sticky-card{break-inside:avoid;margin-bottom:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;transition:all var(--transition);position:relative}
.masonry .sticky-card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.masonry .sticky-card::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--stickies),var(--accent));border-radius:var(--radius) var(--radius) 0 0}
.sticky-title{font-weight:700;font-size:1.05rem;margin-bottom:10px;color:var(--accent2)}
.sticky-fields{display:flex;flex-direction:column;gap:6px}
.sticky-field{font-size:.82rem;color:var(--text2)}.sticky-field strong{color:var(--text);margin-right:4px}
.sticky-actions{display:flex;gap:6px;margin-top:14px;justify-content:flex-end}
.sticky-sensitive{color:var(--warning);font-size:.7rem;margin-top:8px;display:flex;align-items:center;gap:4px}
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
.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px}\r
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
</style>
</head>
<body>
<div class="app">
  <button class="menu-btn" onclick="toggleSidebar()">\u2630</button>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">\u2601\uFE0F <span>\u4E2A\u4EBA\u4E91\u5B58\u50A8</span></div>
    <div class="nav-group">
      <div class="nav-label">\u{1F4C2} \u5206\u7C7B\u6D4F\u89C8</div>
      <button class="nav-item" onclick="setCategory('all')" data-cat="all">
        \u{1F4CB} \u5168\u90E8 <span class="nav-count" id="count-all">0</span>
      </button>
      <button class="nav-item" onclick="setCategory('images')" data-cat="images">
        <span class="nav-dot images"></span> \u56FE\u7247 <span class="nav-count" id="count-images">0</span>
      </button>
      <button class="nav-item" onclick="setCategory('novels')" data-cat="novels">
        <span class="nav-dot novels"></span> \u5C0F\u8BF4 <span class="nav-count" id="count-novels">0</span>
      </button>
      <button class="nav-item" onclick="setCategory('documents')" data-cat="documents">
        <span class="nav-dot documents"></span> \u6587\u6863 <span class="nav-count" id="count-documents">0</span>
      </button>
      <button class="nav-item" onclick="setCategory('stickies')" data-cat="stickies">
        <span class="nav-dot stickies"></span> \u{1F4CC} \u4FBF\u5229\u8D34 <span class="nav-count" id="count-stickies">0</span>
      </button>
    </div>
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
      </div>
    </div>
    <div id="contentArea">
      <div class="loading"><div class="spinner"></div></div>
    </div>
  </main>
</div>
<div id="modalContainer"></div>
<div class="toast-container" id="toastContainer"></div>
<script>const API="/api/items";
let currentCategory="all",allItems=[],currentDetailId=null;
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelector(".nav-item[data-cat='all']").classList.add("active");
  loadItems();
});
function toggleSidebar(){document.getElementById("sidebar").classList.toggle("open")}
function setCategory(cat){
  currentCategory=cat;
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.remove("active"));
  document.querySelector(".nav-item[data-cat='"+cat+"']").classList.add("active");
  document.getElementById("searchInput").value="";
  currentDetailId=null;
  const titles={all:"\u{1F4CB} \u5168\u90E8\u9879\u76EE",images:"\u{1F5BC}\uFE0F \u56FE\u7247",novels:"\u{1F4D6} \u5C0F\u8BF4",documents:"\u{1F4C4} \u6587\u6863",stickies:"\u{1F4CC} \u4FBF\u5229\u8D34"};
  document.getElementById("pageTitle").textContent=titles[cat];
  loadItems();
  if(window.innerWidth<768)document.getElementById("sidebar").classList.remove("open");
}
async function loadItems(){
  const area=document.getElementById("contentArea");
  area.innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const url=currentCategory==="all"?API:API+"?category="+currentCategory;
    const res=await fetch(url);
    if(!res.ok)throw new Error("\u52A0\u8F7D\u5931\u8D25");
    allItems=await res.json();
    updateCounts();
    renderItems(allItems);
  }catch(e){
    area.innerHTML='<div class="empty"><div class="icon">\u26A0\uFE0F</div><h3>\u52A0\u8F7D\u5931\u8D25</h3><p>'+esc(e.message)+'</p></div>';
  }
}\r
async function updateCounts(){
  try{
    const res=await fetch(API+"?counts=1");
    const counts=await res.json();
    ["all","images","novels","documents","stickies"].forEach(cat=>{
      const el=document.getElementById("count-"+cat);
      if(el)el.textContent=counts[cat]||0;
    });
  }catch(e){}
}
function filterItems(){
  const q=document.getElementById("searchInput").value.toLowerCase();
  if(!q){renderItems(allItems);return}
  const filtered=allItems.filter(item=>
    (item.title||"").toLowerCase().includes(q)||
    (item.content||"").toLowerCase().includes(q)||
    (item.fileName||"").toLowerCase().includes(q)
  );
  renderItems(filtered);
}
function renderItems(items){
  const area=document.getElementById("contentArea");
  if(!items.length){
    const icons={all:"\u{1F4ED}",images:"\u{1F5BC}\uFE0F",novels:"\u{1F4D6}",documents:"\u{1F4C4}",stickies:"\u{1F4CC}"};
    area.innerHTML='<div class="empty"><div class="icon">'+(icons[currentCategory]||"\u{1F4ED}")+'</div><h3>\u7A7A\u7A7A\u5982\u4E5F</h3><p>\u70B9\u51FB"\u65B0\u5EFA"\u6309\u94AE\u6DFB\u52A0\u5185\u5BB9\u5427 \u2728</p></div>';
    return;
  }
  if(currentCategory==="stickies"){renderMasonry(items,area);return}
  area.innerHTML='<div class="grid">'+items.map(item=>{
    const catLabels={images:"\u56FE\u7247",novels:"\u5C0F\u8BF4",documents:"\u6587\u6863",stickies:"\u4FBF\u5229\u8D34"};
    const preview=item.fileType&&item.fileType.startsWith("image/")
      ?'<img src="'+item.fileData+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:10px">'
      :('<div class="card-preview">'+(item.content||"\u65E0\u5185\u5BB9\u9884\u89C8").substring(0,150)+'</div>');
    return '<div class="card '+item.category+'" onclick="viewDetail(\\x27'+item.id+'\\x27)">'+preview+
      '<div class="card-header"><span class="card-title">'+esc(item.title)+'</span>'+
      '<span class="card-category '+item.category+'">'+catLabels[item.category]+'</span></div>'+
      '<div class="card-footer"><span>'+fmtDate(item.updatedAt)+'</span>'+
      '<div class="card-actions" onclick="event.stopPropagation()">'+
      '<button class="card-icon-btn" onclick="openEditModal(\\x27'+item.id+'\\x27)" title="\u7F16\u8F91">\u270F\uFE0F</button>'+
      '<button class="card-icon-btn" onclick="downloadItem(\\x27'+item.id+'\\x27)" title="\u4E0B\u8F7D">\u2B07\uFE0F</button>'+
      '<button class="card-icon-btn danger" onclick="confirmDelete(\\x27'+item.id+'\\x27)" title="\u5220\u9664">\u{1F5D1}\uFE0F</button>'+
      '</div></div></div>';
  }).join("")+"</div>";
}\r
function renderMasonry(items,area){
  area.innerHTML='<div class="masonry">'+items.map(item=>{
    let fieldsHtml="";
    if(item.content){
      try{
        const fields=JSON.parse(item.content);
        for(const [key,val] of Object.entries(fields)){
          const isSensitive=key.includes("\u5BC6\u7801")||key.toLowerCase().includes("password")||key.includes("pass");
          fieldsHtml+='<div class="sticky-field"><strong>'+esc(key)+':</strong> '+
            (isSensitive?'<span class="sticky-sensitive">\u{1F512} \u25CF\u25CF\u25CF\u25CF\u25CF\u25CF</span>':esc(String(val)))+'</div>';
        }
      }catch(e){fieldsHtml='<div class="sticky-field">'+esc(item.content.substring(0,200))+'</div>';}
    }
    return '<div class="sticky-card">'+
      '<div class="sticky-title">'+esc(item.title)+'</div>'+
      '<div class="sticky-fields">'+fieldsHtml+'</div>'+
      '<div class="sticky-actions">'+
      '<button class="card-icon-btn" onclick="openEditModal(\\x27'+item.id+'\\x27)" title="\u7F16\u8F91">\u270F\uFE0F</button>'+
      '<button class="card-icon-btn" onclick="downloadItem(\\x27'+item.id+'\\x27)" title="\u4E0B\u8F7D">\u2B07\uFE0F</button>'+
      '<button class="card-icon-btn danger" onclick="confirmDelete(\\x27'+item.id+'\\x27)" title="\u5220\u9664">\u{1F5D1}\uFE0F</button>'+
      '</div></div>';
  }).join("")+"</div>";
}
function viewDetail(id){
  const item=allItems.find(i=>i.id===id);
  if(!item)return;
  currentDetailId=id;
  const catLabels={images:"\u56FE\u7247",novels:"\u5C0F\u8BF4",documents:"\u6587\u6863",stickies:"\u4FBF\u5229\u8D34"};
  const area=document.getElementById("contentArea");
  let contentHtml="";
  if(item.fileType&&item.fileType.startsWith("image/")){
    contentHtml='<img src="'+item.fileData+'" style="max-width:100%;border-radius:var(--radius-sm)">';
  }else if(item.category==="stickies"&&item.content){
    try{
      const fields=JSON.parse(item.content);
      contentHtml='<div class="detail-fields">'+Object.entries(fields).map(([k,v])=>{
        const isSensitive=k.includes("\u5BC6\u7801")||k.toLowerCase().includes("password")||k.includes("pass");
        return '<div class="detail-field"><span class="label">'+esc(k)+'</span>'+
          '<span class="value '+(isSensitive?"mono":"")+'">'+(isSensitive?'\u{1F512} <em style="color:var(--warning)">\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF (\u70B9\u51FB\u7F16\u8F91\u67E5\u770B)</em>':esc(String(v)))+'</span></div>';
      }).join("")+'</div>';
    }catch(e){contentHtml='<pre>'+esc(item.content)+'</pre>';}
  }else{
    contentHtml='<pre>'+(item.content?esc(item.content):"\u65E0\u5185\u5BB9")+'</pre>';
  }
  area.innerHTML=
    '<div class="detail-back" onclick="currentDetailId=null;renderItems(allItems)">\u2190 \u8FD4\u56DE\u5217\u8868</div>'+
    '<div class="header"><h1 class="header-title">'+esc(item.title)+
    ' <span class="card-category '+item.category+'">'+catLabels[item.category]+'</span></h1>'+
    '<div class="header-actions">'+
    '<button class="btn btn-secondary" onclick="openEditModal(\\x27'+item.id+'\\x27)">\u270F\uFE0F \u7F16\u8F91</button>'+
    '<button class="btn btn-secondary" onclick="downloadItem(\\x27'+item.id+'\\x27)">\u2B07\uFE0F \u4E0B\u8F7D</button>'+
    '<button class="btn btn-danger" onclick="confirmDelete(\\x27'+item.id+'\\x27)">\u{1F5D1}\uFE0F \u5220\u9664</button>'+
    '</div></div>'+
    '<div class="detail-content">'+contentHtml+'</div>';
}\r
function openCreateModal(){
  showModal("\u65B0\u5EFA\u9879\u76EE","create",null);
  const cat=currentCategory==="all"?"documents":currentCategory;
  document.getElementById("modal-category").value=cat;
  onCategoryChange();
}
function openEditModal(id){
  const item=allItems.find(i=>i.id===id);
  if(!item)return;
  showModal("\u7F16\u8F91\u9879\u76EE","edit",item);
}
function showModal(title,mode,item){
  const isSticky=mode==="create"?currentCategory==="stickies":(item&&item.category==="stickies");
  const selCat=(item&&item.category)||(currentCategory==="all"?"documents":currentCategory);
  const catOptions=[
    {v:"images",l:"\u{1F5BC}\uFE0F \u56FE\u7247"},{v:"novels",l:"\u{1F4D6} \u5C0F\u8BF4"},
    {v:"documents",l:"\u{1F4C4} \u6587\u6863"},{v:"stickies",l:"\u{1F4CC} \u4FBF\u5229\u8D34"}
  ].map(c=>'<option value="'+c.v+'"'+(selCat===c.v?" selected":"")+'>'+c.l+'</option>').join("");
  const container=document.getElementById("modalContainer");
  container.innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()">'+
    '<div class="modal"><h2>'+title+'</h2>'+
    '<div class="form-group"><label>\u5206\u7C7B</label><select id="modal-category" onchange="onCategoryChange()">'+catOptions+'</select></div>'+
    '<div class="form-group"><label>\u6807\u9898 *</label><input type="text" id="modal-title" value="'+escAttr(item?item.title:"")+'" placeholder="\u8F93\u5165\u6807\u9898"></div>'+
    '<div id="stickyFields">'+(isSticky?getStickyFieldsHtml(item):'<div class="form-group"><label>'+((item&&item.fileData)?"\u6587\u4EF6\u5DF2\u4E0A\u4F20":"\u5185\u5BB9")+'</label><textarea id="modal-content" placeholder="\u8F93\u5165\u5185\u5BB9...">'+escAttr(item?item.content||"":"")+'</textarea></div>')+'</div>'+
    '<div id="fileUploadArea">'+(isSticky?"":getFileUploadHtml(item))+'</div>'+
    '<div class="form-actions"><button class="btn btn-secondary" onclick="closeModal()">\u53D6\u6D88</button>'+
    '<button class="btn btn-primary" onclick="submitForm(\\x27'+mode+'\\x27'+(item?',\\x27'+item.id+'\\x27':"")+')">'+(mode==="create"?"\u521B\u5EFA":"\u4FDD\u5B58")+'</button></div>'+
    '</div></div>';
  if(item&&item.fileData){
    var hf=document.getElementById("modal-has-file");
    if(hf)hf.style.display="block";
  }
}\r
function getStickyFieldsHtml(item){
  let fields={};
  if(item&&item.content){try{fields=JSON.parse(item.content)}catch(e){}}
  if(Object.keys(fields).length===0)fields={"\\u8D26\\u53F7/\\u5E73\\u53F0":"","\\u7528\\u6237\\u540D":"","\\u5BC6\\u7801":"","\\u5907\\u6CE8":""};
  return '<div id="stickyFieldsContainer">'+Object.entries(fields).map(([k,v],i)=>
    '<div class="form-group sticky-field-row" style="display:flex;gap:8px;align-items:center">'+
    '<input type="text" value="'+escAttr(k)+'" placeholder="\u5B57\u6BB5\u540D" style="flex:1" class="sticky-key">'+
    '<div class="pw-field" style="flex:1"><input type="password" value="'+escAttr(v)+'" placeholder="\u503C" class="sticky-val">'+
    '<button class="pw-toggle" onclick="togglePw(this)">\u{1F441}\uFE0F</button></div>'+
    '<button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">\u2715</button>'+
    '</div>'
  ).join("")+'</div>'+
  '<button class="btn btn-sm btn-secondary" onclick="addStickyField()" style="margin-top:8px">\uFF0B \u6DFB\u52A0\u5B57\u6BB5</button>';
}
function addStickyField(){
  const container=document.getElementById("stickyFieldsContainer");
  const row=document.createElement("div");
  row.className="form-group sticky-field-row";
  row.style.cssText="display:flex;gap:8px;align-items:center";
  row.innerHTML=
    '<input type="text" placeholder="\u5B57\u6BB5\u540D" style="flex:1" class="sticky-key">'+
    '<div class="pw-field" style="flex:1"><input type="password" placeholder="\u503C" class="sticky-val">'+
    '<button class="pw-toggle" onclick="togglePw(this)">\u{1F441}\uFE0F</button></div>'+
    '<button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">\u2715</button>';
  container.appendChild(row);
}
function togglePw(btn){
  const input=btn.parentElement.querySelector("input");
  input.type=input.type==="password"?"text":"password";
  btn.textContent=input.type==="password"?"\u{1F441}\uFE0F":"\u{1F648}";
}
function getFileUploadHtml(item){
  const hasFile=item&&item.fileData;
  return '<div class="form-group"><label>\u6587\u4EF6\u9644\u4EF6</label>'+
    (hasFile?
      '<div class="file-preview" id="modal-has-file">'+
      (item.fileType&&item.fileType.startsWith("image/")?'<img src="'+item.fileData+'">':'<span>\u{1F4CE}</span>')+
      '<span class="name">'+esc(item.fileName)+'</span>'+
      '<span class="size">'+formatSize(item.fileSize||0)+'</span>'+
      '<span class="remove" onclick="removeFile()">\u2715</span></div>':
      '<div class="file-drop" onclick="document.getElementById(\\x27fileInput\\x27).click()" id="fileDrop"><div class="icon">\u{1F4C1}</div><p>\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20</p></div>')+
    '<input type="file" id="fileInput" style="display:none" onchange="handleFileSelect(event)"></div>';
}\r
let selectedFile=null;
function handleFileSelect(e){
  const file=e.target.files[0];
  if(!file)return;
  if(file.size>10*1024*1024){toast("\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC710MB","error");return}
  selectedFile=file;
  const reader=new FileReader();
  reader.onload=function(ev){
    const drop=document.getElementById("fileDrop");
    if(drop){
      drop.innerHTML='<div class="file-preview">'+
        (file.type.startsWith("image/")?'<img src="'+ev.target.result+'">':'<span>\u{1F4CE}</span>')+
        '<span class="name">'+esc(file.name)+'</span><span class="size">'+formatSize(file.size)+'</span>'+
        '<span class="remove" onclick="removeFile()">\u2715</span></div>';
    }
  };
  reader.readAsDataURL(file);
}
function removeFile(){selectedFile=null;const drop=document.getElementById("fileDrop");if(drop)drop.innerHTML='<div class="icon">\u{1F4C1}</div><p>\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20</p>'}
document.addEventListener("dragover",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.add("drag")});
document.addEventListener("dragleave",e=>{const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag")});
document.addEventListener("drop",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag");if(e.dataTransfer.files.length)handleFileSelect({target:{files:e.dataTransfer.files}})});
function onCategoryChange(){
  const cat=document.getElementById("modal-category").value;
  const stickyDiv=document.getElementById("stickyFields");
  const fileDiv=document.getElementById("fileUploadArea");
  if(cat==="stickies"){stickyDiv.innerHTML=getStickyFieldsHtml(null);fileDiv.innerHTML=""}
  else{stickyDiv.innerHTML='<div class="form-group"><label>\u5185\u5BB9</label><textarea id="modal-content" placeholder="\u8F93\u5165\u5185\u5BB9..."></textarea></div>';fileDiv.innerHTML=getFileUploadHtml(null)}
}
function closeModal(){document.getElementById("modalContainer").innerHTML="";selectedFile=null}\r
async function submitForm(mode,id){
  const title=document.getElementById("modal-title").value.trim();
  if(!title){toast("\u8BF7\u8F93\u5165\u6807\u9898","error");return}
  const category=document.getElementById("modal-category").value;
  let content="",fileData=null,fileName=null,fileType=null,fileSize=0;
  if(category==="stickies"){
    const keys=document.querySelectorAll(".sticky-key");
    const vals=document.querySelectorAll(".sticky-val");
    const obj={};
    keys.forEach((k,i)=>{if(k.value.trim())obj[k.value.trim()]=vals[i]?vals[i].value:""});
    if(Object.keys(obj).length===0){toast("\u8BF7\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u5B57\u6BB5","error");return}
    content=JSON.stringify(obj);
  }else{
    const ta=document.getElementById("modal-content");
    if(ta)content=ta.value;
    if(selectedFile){
      fileData=await readFileAsDataURL(selectedFile);
      fileName=selectedFile.name;fileType=selectedFile.type;fileSize=selectedFile.size;
    }else if(mode==="edit"){
      const existing=allItems.find(i=>i.id===id);
      if(existing){fileData=existing.fileData;fileName=existing.fileName;fileType=existing.fileType;fileSize=existing.fileSize}
    }
  }
  const body={title,content,category};
  if(fileData){body.fileData=fileData;body.fileName=fileName;body.fileType=fileType;body.fileSize=fileSize}
  try{
    const url=mode==="create"?API:API+"/"+id;
    const method=mode==="create"?"POST":"PUT";
    const res=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok){const e=await res.json();throw new Error(e.error||"\u64CD\u4F5C\u5931\u8D25")}
    closeModal();toast(mode==="create"?"\u521B\u5EFA\u6210\u529F\uFF01":"\u66F4\u65B0\u6210\u529F\uFF01","success");
    await loadItems();
  }catch(e){toast(e.message,"error")}
}
function readFileAsDataURL(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}
function confirmDelete(id){
  const container=document.getElementById("modalContainer");
  container.innerHTML='<div class="confirm-overlay"><div class="confirm-dialog"><h3>\u786E\u8BA4\u5220\u9664</h3><p>\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\uFF0C\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F</p><div class="confirm-actions"><button class="btn btn-secondary" onclick="closeModal()">\u53D6\u6D88</button><button class="btn btn-danger" onclick="deleteItem(\\x27'+id+'\\x27)">\u786E\u8BA4\u5220\u9664</button></div></div></div>';
}
async function deleteItem(id){
  try{const res=await fetch(API+"/"+id,{method:"DELETE"});if(!res.ok)throw new Error("\u5220\u9664\u5931\u8D25");
    closeModal();toast("\u5DF2\u5220\u9664","success");if(currentDetailId===id)currentDetailId=null;await loadItems();
  }catch(e){toast(e.message,"error")}
}\r
function downloadItem(id){
  const item=allItems.find(i=>i.id===id);
  if(!item)return;
  let blob,ext;
  if(item.fileData){
    const arr=item.fileData.split(",");
    const mime=arr[0].match(/:(.*?);/);
    const bstr=atob(arr[1]);const n=bstr.length;
    const u8=new Uint8Array(n);
    for(let i=0;i<n;i++)u8[i]=bstr.charCodeAt(i);
    blob=new Blob([u8],{type:mime?mime[1]:"application/octet-stream"});
    ext=item.fileName?item.fileName.split(".").pop():"bin";
  }else{
    let text=item.content||"";
    if(item.category==="stickies"){try{const f=JSON.parse(text);text=Object.entries(f).map(([k,v])=>k+": "+v).join("\\n")}catch(e){}}
    blob=new Blob([text],{type:"text/plain;charset=utf-8"});ext="txt";
  }
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=(item.title||"download")+"."+ext;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},100);
  toast("\u4E0B\u8F7D\u5F00\u59CB\uFF01","success");
}
function toast(msg,type){
  const container=document.getElementById("toastContainer");
  const el=document.createElement("div");el.className="toast "+type;el.textContent=msg;
  container.appendChild(el);
  setTimeout(()=>{el.style.opacity="0";el.style.transition="opacity .3s";setTimeout(()=>el.remove(),300)},2500);
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function escAttr(s){return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function fmtDate(d){if(!d)return"";return new Date(d).toLocaleDateString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
function formatSize(b){if(!b)return"0 B";const u=["B","KB","MB","GB"];let i=0;while(b>=1024&&i<3){b/=1024;i++}return b.toFixed(1)+" "+u[i]}\r
<\/script>
</body>
</html>\r
`;

// src/worker.js
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
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
__name(corsHeaders, "corsHeaders");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
__name(generateId, "generateId");
async function listItems(env, category) {
  const prefix = category ? "item:" + category + ":" : "item:";
  const result = await env.PERSONAL_CLOUD_KV.list({ prefix });
  const items = [];
  for (const key of result.keys) {
    const val = await env.PERSONAL_CLOUD_KV.get(key.name, "json");
    if (val) items.push(val);
  }
  items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return items;
}
__name(listItems, "listItems");
async function getCounts(env) {
  const all = await env.PERSONAL_CLOUD_KV.list({ prefix: "item:" });
  const counts = { all: 0, images: 0, novels: 0, documents: 0, stickies: 0 };
  for (const key of all.keys) {
    counts.all++;
    const parts = key.name.split(":");
    if (parts.length >= 2) {
      const cat = parts[1];
      if (counts[cat] !== void 0) counts[cat]++;
    }
  }
  return counts;
}
__name(getCounts, "getCounts");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (path === "/" || path === "/index.html") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
    if (path === "/api/items" || path === "/api/items/") {
      if (request.method === "GET") {
        if (url.searchParams.has("counts")) {
          const counts = await getCounts(env);
          return json(counts);
        }
        const category = url.searchParams.get("category") || null;
        const items = await listItems(env, category);
        return json(items);
      }
      if (request.method === "POST") {
        try {
          const body = await request.json();
          if (!body.title || !body.category) return error("\u6807\u9898\u548C\u5206\u7C7B\u4E3A\u5FC5\u586B\u9879");
          const id = generateId();
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const item = {
            id,
            title: body.title,
            content: body.content || "",
            category: body.category,
            fileData: body.fileData || null,
            fileName: body.fileName || null,
            fileType: body.fileType || null,
            fileSize: body.fileSize || 0,
            createdAt: now,
            updatedAt: now
          };
          await env.PERSONAL_CLOUD_KV.put("item:" + item.category + ":" + id, JSON.stringify(item));
          return json(item, 201);
        } catch (e) {
          return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF: " + e.message);
        }
      }
    }
    const match = path.match(/^\/api\/items\/([a-z0-9]+)$/);
    if (match) {
      const itemId = match[1];
      if (request.method === "GET") {
        const cats = ["images", "novels", "documents", "stickies"];
        for (const cat of cats) {
          const item = await env.PERSONAL_CLOUD_KV.get("item:" + cat + ":" + itemId, "json");
          if (item) return json(item);
        }
        return error("\u672A\u627E\u5230", 404);
      }
      if (request.method === "PUT") {
        try {
          const body = await request.json();
          const cats = ["images", "novels", "documents", "stickies"];
          let existing = null;
          let oldKey = null;
          for (const cat of cats) {
            const key = "item:" + cat + ":" + itemId;
            const val = await env.PERSONAL_CLOUD_KV.get(key, "json");
            if (val) {
              existing = val;
              oldKey = key;
              break;
            }
          }
          if (!existing) return error("\u672A\u627E\u5230", 404);
          const newCategory = body.category || existing.category;
          const updated = {
            ...existing,
            title: body.title !== void 0 ? body.title : existing.title,
            content: body.content !== void 0 ? body.content : existing.content,
            category: newCategory,
            fileData: body.fileData !== void 0 ? body.fileData : existing.fileData,
            fileName: body.fileName !== void 0 ? body.fileName : existing.fileName,
            fileType: body.fileType !== void 0 ? body.fileType : existing.fileType,
            fileSize: body.fileSize !== void 0 ? body.fileSize : existing.fileSize,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          const newKey = "item:" + newCategory + ":" + itemId;
          if (oldKey !== newKey) {
            await env.PERSONAL_CLOUD_KV.delete(oldKey);
          }
          await env.PERSONAL_CLOUD_KV.put(newKey, JSON.stringify(updated));
          return json(updated);
        } catch (e) {
          return error("\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF: " + e.message);
        }
      }
      if (request.method === "DELETE") {
        const cats = ["images", "novels", "documents", "stickies"];
        for (const cat of cats) {
          const key = "item:" + cat + ":" + itemId;
          const val = await env.PERSONAL_CLOUD_KV.get(key, "json");
          if (val) {
            await env.PERSONAL_CLOUD_KV.delete(key);
            return json({ success: true });
          }
        }
        return error("\u672A\u627E\u5230", 404);
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

// .wrangler/tmp/bundle-ZTYxm3/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-ZTYxm3/middleware-loader.entry.ts
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
