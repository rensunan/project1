// ============================================================
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
let AUTH_TOKEN=localStorage.getItem("auth_token")||"";
let BLOB_CONFIG=null;
async function getBlobConfig(){if(BLOB_CONFIG)return BLOB_CONFIG;try{const r=await apiFetch("/blob-config");if(r.ok){BLOB_CONFIG=await r.json()}return BLOB_CONFIG}catch(e){return null}}
let currentCategory="all",allItems=[],currentDetailId=null;

// ============================================================
// 🔐 认证
// ============================================================
function setToken(token){AUTH_TOKEN=token;localStorage.setItem("auth_token",token)}
function clearToken(){AUTH_TOKEN="";localStorage.removeItem("auth_token")}
async function apiFetch(path,options={}){
  const headers={...(options.headers||{})};
  if(AUTH_TOKEN)headers["Authorization"]="Bearer "+AUTH_TOKEN;
  return fetch(API+path,{...options,headers});
}
async function doLogin(){
  const user=document.getElementById("loginUser").value.trim();
  const pass=document.getElementById("loginPass").value;
  const errEl=document.getElementById("loginError");
  if(!user||!pass){errEl.textContent="请输入用户名和密码";return}
  try{
    const res=await fetch(API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:user,password:pass})});
    const data=await res.json();
    if(!res.ok){errEl.textContent=data.error||"登录失败";return}
    setToken(data.token);
    if(data.username)localStorage.setItem("auth_username",data.username);
    errEl.textContent="";
    showMainApp();
  }catch(e){errEl.textContent="网络错误，请重试"}
}
function toggleLoginPw(){const i=document.getElementById("loginPass");i.type=i.type==="password"?"text":"password"}
async function checkAuth(){if(!AUTH_TOKEN)return false;try{const r=await apiFetch("/auth/check");const d=await r.json();return d.valid===true}catch(e){return false}}
async function logout(){try{await apiFetch("/auth/logout",{method:"POST"})}catch(e){}clearToken();closeModal();document.getElementById("mainApp").style.display="none";document.getElementById("loginScreen").style.display="flex"}
function showMainApp(){document.getElementById("loginScreen").style.display="none";document.getElementById("mainApp").style.display="flex";buildSidebar();setCategory("all");loadItems()}
document.addEventListener("keydown",function(e){const ls=document.getElementById("loginScreen");if(ls&&ls.style.display!=="none"&&e.key==="Enter")doLogin()});

// ============================================================
// ⚙️ 设置
// ============================================================
function openSettings(){
  const username=localStorage.getItem("auth_username")||"未知";
  document.getElementById("modalContainer").innerHTML=
    '<div class="modal"><h2>⚙️ 账户设置</h2>'+
    '<h3>当前账户</h3><p style="padding:8px 0;color:var(--text2)">用户名: <strong>'+esc(username)+'</strong></p>'+
    '<h3>修改登录凭证</h3>'+
    '<div class="form-group"><label>新用户名</label><input type="text" id="settingsNewUser" placeholder="留空不修改"></div>'+
    '<div class="form-group"><label>当前密码 *</label><input type="password" id="settingsCurPass" placeholder="请输入当前密码"></div>'+
    '<div class="form-group"><label>新密码</label><input type="password" id="settingsNewPass" placeholder="留空不修改"></div>'+
    '<div id="settingsError" style="color:var(--danger);margin-bottom:8px"></div>'+
    '<button class="btn btn-primary" onclick="changeCredentials()">💾 保存修改</button>'+
    '<hr style="margin:16px 0;border-color:var(--border)"><h3>退出登录</h3>'+
    '<button class="btn btn-danger" onclick="logout()">🚪 退出登录</button>'+
    '<div style="margin-top:16px"><button class="btn btn-secondary" onclick="closeModal()">关闭</button></div></div>';
}
async function changeCredentials(){
  const errEl=document.getElementById("settingsError");
  const newUser=document.getElementById("settingsNewUser").value.trim();
  const curPass=document.getElementById("settingsCurPass").value;
  const newPass=document.getElementById("settingsNewPass").value;
  if(!curPass){errEl.textContent="请输入当前密码";return}
  if(!newUser&&!newPass){errEl.textContent="请至少修改用户名或密码";return}
  try{
    const body={currentPassword:curPass};if(newUser)body.newUsername=newUser;if(newPass)body.newPassword=newPass;
    const res=await apiFetch("/auth/change",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const data=await res.json();
    if(!res.ok){errEl.textContent=data.error||"修改失败";return}
    toast("凭证已更新，请牢记新密码 ✨","success");
    if(data.username)localStorage.setItem("auth_username",data.username);
    setTimeout(()=>closeModal(),1000);
  }catch(e){errEl.textContent="网络错误"}
}

// ============================================================
// 📂 侧边栏
// ============================================================
function buildSidebar(){
  const sidebar=document.getElementById("sidebar");
  let html='<div class="sidebar-logo">☁️ <span>个人云存储</span></div>';
  html+='<div class="nav-group"><div class="nav-label">📂 分类浏览</div>';
  html+='<button class="nav-item" onclick="setCategory(\'all\')" data-cat="all">📋 全部 <span class="nav-count" id="count-all">0</span></button>';
  CATEGORY_LIST.forEach(c=>{html+='<button class="nav-item" onclick="setCategory(\''+c.id+'\')" data-cat="'+c.id+'">'+c.icon+' '+c.label+' <span class="nav-count" id="count-'+c.id+'">0</span></button>'});
  html+='</div><div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border)">';
  html+='<button class="nav-item" onclick="openSettings()">⚙️ 设置</button>';
  html+='<button class="nav-item" onclick="logout()" style="color:var(--danger)">🚪 退出</button></div>';
  sidebar.innerHTML=html;
}
function setCategory(cat){
  currentCategory=cat;
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.remove("active"));
  const navItem=document.querySelector(".nav-item[data-cat='"+cat+"']");if(navItem)navItem.classList.add("active");
  loadItems();
}
async function updateCounts(){
  try{const res=await apiFetch("/items?counts=1");if(res.ok){const c=await res.json();Object.entries(c).forEach(([k,v])=>{const el=document.getElementById("count-"+k);if(el)el.textContent=v})}}catch(e){}
}

// ============================================================
// 📋 列表 & 统计
// ============================================================
async function loadItems(){
  const area=document.getElementById("contentArea");area.innerHTML='<div class="loading"><div class="spinner"></div></div>';
  try{
    const url=currentCategory==="all"?"/items":"/items?category="+currentCategory;
    const res=await apiFetch(url);if(!res.ok)throw new Error("加载失败");
    allItems=await res.json();updateCounts();loadStats();renderItems(allItems);
  }catch(e){area.innerHTML='<div class="empty"><div class="icon">⚠️</div><h3>加载失败</h3><p>'+esc(e.message)+'</p></div>'}
}
async function loadStats(){
  try{const res=await apiFetch("/stats");const stats=await res.json();renderStats(stats)}catch(e){}
}
function renderStats(stats){
  const bar=document.getElementById("statsBar");if(!stats.totalItems){bar.style.display="none";return}
  bar.style.display="block";
  document.getElementById("statsTotal").innerHTML='共 <strong>'+stats.totalItems+'</strong> 项 · <strong>'+formatSize(stats.totalSize)+'</strong>';
  const progress=document.getElementById("statsProgress");let html="";
  CATEGORY_LIST.forEach(c=>{const cs=stats.categories[c.id];if(cs&&cs.size>0){const pct=(cs.size/stats.totalSize*100).toFixed(1);html+='<div class="stats-segment" style="width:'+pct+'%;background:'+c.color+'" title="'+c.label+': '+formatSize(cs.size)+' ('+cs.count+'项)"></div>'}});
  progress.innerHTML=html||'<div class="stats-empty">暂无数据</div>';
  const legend=document.getElementById("statsLegend");
  legend.innerHTML=CATEGORY_LIST.map(c=>{const cs=stats.categories[c.id];const s=cs?cs.size:0;const n=cs?cs.count:0;return '<div class="stats-legend-item"><span class="stats-legend-dot" style="background:'+c.color+'"></span>'+c.icon+' '+c.label+': <strong>'+formatSize(s)+'</strong> ('+n+'项)</div>'}).join("");
}
function renderItems(items){
  const area=document.getElementById("contentArea");
  if(!items.length){area.innerHTML='<div class="empty"><div class="icon">'+(EMPTY_ICONS[currentCategory]||"📭")+'</div><h3>空空如也</h3><p>点击"新建"按钮添加内容吧 ✨</p></div>';return}
  area.innerHTML='<div class="grid">'+items.map(item=>{
    const cat=CATEGORIES[item.category];const label=cat?cat.label:item.category;const color=cat?cat.color:"#7c5cfc";
    let cardBody="";
    if(item.hasFile){const isImg=item.fileType&&item.fileType.startsWith("image/");cardBody='<div class="card-file-icon">'+(isImg?"🖼️":"📁")+'</div><div class="card-file-meta"><span class="card-file-name">'+esc(item.fileName||"未命名文件")+'</span><span class="card-file-size">'+formatSize(item.fileSize||0)+'</span></div>'}
    else{cardBody='<div class="card-preview" style="color:var(--text2);font-style:italic">点击查看详情 →</div>'}
    return '<div class="card" style="--cat-color:'+color+'" onclick="viewDetail(\''+item.id+'\')">'+cardBody+'<div class="card-header"><span class="card-title">'+esc(item.title)+'</span><span class="card-category" style="background:'+color+'22;color:'+color+'">'+label+'</span></div><div class="card-footer"><span>'+fmtDate(item.updatedAt)+'</span><div class="card-actions" onclick="event.stopPropagation()"><button class="card-icon-btn" onclick="openEditModal(\''+item.id+'\')" title="编辑">✏️</button><button class="card-icon-btn" onclick="downloadItem(\''+item.id+'\')" title="下载">⬇️</button><button class="card-icon-btn danger" onclick="confirmDelete(\''+item.id+'\')" title="删除">🗑️</button></div></div></div>';
  }).join("")+"</div>";
}

// ============================================================
// 🔍 详情 - 点击时懒加载内容
// ============================================================
async function viewDetail(id){
  let item=allItems.find(i=>i.id===id);if(!item)return;
  if(!item._fullLoaded){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();item=Object.assign(item,full,{_fullLoaded:true});const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)allItems[idx]=item}}catch(e){}}
  currentDetailId=id;const cat=CATEGORIES[item.category];const label=cat?cat.label:item.category;const color=cat?cat.color:"#7c5cfc";const area=document.getElementById("contentArea");
  let contentHtml="";
  if(item.hasFile&&item.fileType&&item.fileType.startsWith("image/")){
    contentHtml='<img src="/api/items/'+item.id+'/download?t='+AUTH_TOKEN+'" style="max-width:100%;border-radius:var(--radius-sm)" onerror="this.outerHTML=\'<div class=lazy-placeholder><div class=lazy-icon>⚠️</div><p>加载失败</p></div>\'">';
  }else if(item.hasFile){
    contentHtml='<div class="detail-file-info"><div class="file-type-icon">📄</div><div><strong>'+esc(item.fileName||"文件")+'</strong></div><div class="text2">'+formatSize(item.fileSize||0)+'</div></div>';
  }else if(item.category==="stickies"&&item.content){
    try{const fields=JSON.parse(item.content);contentHtml='<div class="detail-fields">'+Object.entries(fields).map(([k,v])=>{const isSensitive=k.includes("密码")||k.toLowerCase().includes("password")||k.includes("pass");return '<div class="detail-field"><span class="label">'+esc(k)+'</span><span class="value '+(isSensitive?"mono":"")+'">'+(isSensitive?'🔒 <em style="color:var(--warning)">●●●●●● (点击编辑查看)</em>':esc(String(v)))+'</span></div>'}).join("")+'</div>'}catch(e){contentHtml='<pre>'+esc(item.content)+'</pre>'}
  }else{contentHtml='<pre>'+(item.content?esc(item.content):"无内容")+'</pre>'}
  area.innerHTML='<div class="detail-back" onclick="currentDetailId=null;renderItems(allItems)">← 返回列表</div><div class="header"><h1 class="header-title">'+esc(item.title)+' <span class="card-category" style="background:'+color+'22;color:'+color+'">'+label+'</span></h1><div class="header-actions"><button class="btn btn-secondary" onclick="openEditModal(\''+item.id+'\')">✏️ 编辑</button><button class="btn btn-secondary" onclick="downloadItem(\''+item.id+'\')">⬇️ 下载</button><button class="btn btn-danger" onclick="confirmDelete(\''+item.id+'\')">🗑️ 删除</button></div></div><div class="detail-content">'+contentHtml+'</div>';
}

// ============================================================
// ⬇️ 下载 - 文件用原生<a>标签(快), 文本用blob
// ============================================================
async function downloadItem(id){
  const item=allItems.find(i=>i.id===id);if(!item)return;
  if(item.hasFile){
    toast("下载开始！","success");const a=document.createElement("a");
    a.href="/api/items/"+id+"/download?t="+AUTH_TOKEN;a.download=item.fileName||item.title||"download";
    document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),100);
  }else{
    if(!item.content){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();if(full.content)item.content=full.content}}catch(e){}}
    if(!item.content){toast("请先点击查看详情","error");return}
    let text=item.content||"";if(item.category==="stickies"){try{const f=JSON.parse(text);text=Object.entries(f).map(([k,v])=>k+": "+v).join("\n")}catch(e){}}
    const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=(item.title||"download")+".txt";
    document.body.appendChild(a);a.click();setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},1000);
    toast("下载开始！","success");
  }
}

// ============================================================
// ➕ 创建/编辑模态框
// ============================================================
function openCreateModal(){showModal("新建项目","create",null);const cat=currentCategory==="all"?DEFAULT_CATEGORY:currentCategory;document.getElementById("modal-category").value=cat;onCategoryChange()}
async function openEditModal(id){
  let item=allItems.find(i=>i.id===id);if(!item)return;
  if(!item._fullLoaded){try{const res=await apiFetch("/items/"+id);if(res.ok){const full=await res.json();item=Object.assign(item,full,{_fullLoaded:true});const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)allItems[idx]=item}}catch(e){}}
  showModal("编辑项目","edit",item);
}
function showModal(title,mode,item){
  const isSticky=mode==="create"?currentCategory==="stickies":(item&&item.category==="stickies");
  const selCat=(item&&item.category)||(currentCategory==="all"?DEFAULT_CATEGORY:currentCategory);
  const catOptions=CATEGORY_LIST.map(c=>'<option value="'+c.id+'"'+(selCat===c.id?" selected":"")+'>'+c.icon+' '+c.label+'</option>').join("");
  const container=document.getElementById("modalContainer");
  container.innerHTML='<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><h2>'+title+'</h2>'+
    '<div class="form-group"><label>分类</label><select id="modal-category" onchange="onCategoryChange()">'+catOptions+'</select></div>'+
    '<div class="form-group"><label>标题 *</label><input type="text" id="modal-title" value="'+escAttr(item?item.title:"")+'" placeholder="输入标题"></div>'+
    '<div id="stickyFields">'+(isSticky?getStickyFieldsHtml(item):'<div class="form-group"><label>内容</label><textarea id="modal-content" placeholder="输入内容...">'+escAttr(item?item.content||"":"")+'</textarea></div>')+'</div>'+
    '<div id="fileUploadArea">'+(isSticky?"":getFileUploadHtml(item))+'</div>'+
    '<div class="form-actions"><button class="btn btn-secondary" onclick="closeModal()">取消</button>'+
    '<button class="btn btn-primary" onclick="submitForm(\''+mode+'\''+(item?',\''+item.id+'\'':"")+')">'+(mode==="create"?"创建":"保存")+'</button></div></div></div>';
}
function getStickyFieldsHtml(item){
  let fields={};if(item&&item.content){try{fields=JSON.parse(item.content)}catch(e){}}
  if(Object.keys(fields).length===0)fields={"账号/平台":"","用户名":"","密码":"","备注":""};
  return '<div id="stickyFieldsContainer">'+Object.entries(fields).map(([k,v],i)=>
    '<div class="form-group sticky-field-row" style="display:flex;gap:8px;align-items:center"><input type="text" value="'+escAttr(k)+'" placeholder="字段名" style="flex:1" class="sticky-key"><div class="pw-field" style="flex:1"><input type="password" value="'+escAttr(v)+'" placeholder="值" class="sticky-val"><button class="pw-toggle" onclick="togglePw(this)">👁️</button></div><button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">✕</button></div>'
  ).join("")+'</div><button class="btn btn-sm btn-secondary" onclick="addStickyField()" style="margin-top:8px">＋ 添加字段</button>';
}
function addStickyField(){const c=document.getElementById("stickyFieldsContainer");const r=document.createElement("div");r.className="form-group sticky-field-row";r.style.cssText="display:flex;gap:8px;align-items:center";r.innerHTML='<input type="text" placeholder="字段名" style="flex:1" class="sticky-key"><div class="pw-field" style="flex:1"><input type="password" placeholder="值" class="sticky-val"><button class="pw-toggle" onclick="togglePw(this)">👁️</button></div><button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()" style="flex-shrink:0">✕</button>';c.appendChild(r)}
function togglePw(btn){const i=btn.parentElement.querySelector("input");i.type=i.type==="password"?"text":"password";btn.textContent=i.type==="password"?"👁️":"🙈"}
function onCategoryChange(){const cat=document.getElementById("modal-category").value;const cfg=CATEGORIES[cat];const sd=document.getElementById("stickyFields");const fd=document.getElementById("fileUploadArea");if(cfg&&cfg.isSticky){sd.innerHTML=getStickyFieldsHtml(null);fd.innerHTML=""}else{sd.innerHTML='<div class="form-group"><label>内容</label><textarea id="modal-content" placeholder="输入内容..."></textarea></div>';fd.innerHTML=getFileUploadHtml(null)}}
function getFileUploadHtml(item){const hasFile=item&&item.fileData;return '<div class="form-group"><label>文件附件</label>'+(hasFile?'<div class="file-preview"><span>📄</span><span class="name">'+esc(item.fileName)+'</span><span class="size">'+formatSize(item.fileSize||0)+'</span></div>':'<div class="file-drop" onclick="document.getElementById(\'fileInput\').click()" id="fileDrop"><div class="icon">📁</div><p>点击或拖拽文件到此处上传</p></div>')+'<input type="file" id="fileInput" style="display:none" onchange="handleFileSelect(event)"></div>';}
let selectedFile=null;
function handleFileSelect(e){const file=e.target.files[0];if(!file)return;if(file.size>20*1024*1024){toast("文件不能超过5MB","error");return}selectedFile=file;const reader=new FileReader();reader.onload=function(ev){const drop=document.getElementById("fileDrop");if(drop){const isImg=file.type.startsWith("image/");drop.innerHTML='<div class="file-preview">'+(isImg?'<img src="'+ev.target.result+'">':'<span>'+getFileIcon(file.type)+'</span>')+'<span class="name">'+esc(file.name)+'</span><span class="size">'+formatSize(file.size)+'</span><span class="remove" onclick="removeFile()">✕</span></div>'}};reader.readAsDataURL(file)}
function getFileIcon(t){if(!t)return"📄";if(t.startsWith("image/"))return"🖼️";if(t.startsWith("video/"))return"🎬";if(t.startsWith("audio/"))return"🎵";if(t.startsWith("text/"))return"📝";if(t.includes("pdf"))return"📕";if(t.includes("zip")||t.includes("rar")||t.includes("gz"))return"📦";if(t.includes("word")||t.includes("document"))return"📄";if(t.includes("excel")||t.includes("sheet"))return"📊";return"📁"}
function removeFile(){selectedFile=null;document.getElementById("uploadProgress").style.display="none";const drop=document.getElementById("fileDrop");if(drop)drop.innerHTML='<div class="icon">📁</div><p>点击或拖拽文件到此处上传</p>'}
document.addEventListener("dragover",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.add("drag")});
document.addEventListener("dragleave",e=>{const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag")});
document.addEventListener("drop",e=>{e.preventDefault();const d=document.getElementById("fileDrop");if(d)d.classList.remove("drag");if(e.dataTransfer.files.length)handleFileSelect({target:{files:e.dataTransfer.files}})});

// ============================================================
// 📤 提交表单 - 非阻塞上传, 直接插入列表
// ============================================================

// Direct upload to Netlify Blobs (bypasses 6MB function limit)
async function uploadToBlobs(file, onProgress){
  const cfg=await getBlobConfig();
  if(!cfg||!cfg.token){throw new Error("无法获取上传配置")}
  const key="file:"+Date.now()+"_"+Math.random().toString(36).slice(2,8);
  const url=(cfg.apiURL||"https://api.netlify.com")+"/api/v1/blobs/"+cfg.siteID+"/personal-cloud/"+encodeURIComponent(key);
  return new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();
    xhr.open("PUT",url);
    xhr.setRequestHeader("Authorization","Bearer "+cfg.token);
    xhr.setRequestHeader("Content-Type","application/octet-stream");
    xhr.upload.onprogress=e=>{if(e.lengthComputable&&onProgress){onProgress(Math.round(e.loaded/e.total*100))}};
    xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){resolve({key,fileName:file.name,fileType:file.type,fileSize:file.size})}else{try{reject(new Error(JSON.parse(xhr.responseText).error||"上传失败"))}catch(e){reject(new Error("上传失败: "+xhr.status))}}};
    xhr.onerror=()=>reject(new Error("网络错误"));
    xhr.send(file);
  });
}

async function submitForm(mode,id){
  const title=document.getElementById("modal-title").value.trim();if(!title){toast("请输入标题","error");return}
  const category=document.getElementById("modal-category").value;const cfg=CATEGORIES[category];const isSticky=cfg&&cfg.isSticky;
  let stickyData=null,fileContent="";
  if(isSticky){const keys=document.querySelectorAll(".sticky-key");const vals=document.querySelectorAll(".sticky-val");const obj={};keys.forEach((k,i)=>{if(k.value.trim())obj[k.value.trim()]=vals[i]?vals[i].value:""});if(Object.keys(obj).length===0){toast("请至少添加一个字段","error");return}stickyData=JSON.stringify(obj)}
  else{const ta=document.getElementById("modal-content");fileContent=ta?ta.value:""}
  const uploadFile=selectedFile;
  const toastId="toast_"+Date.now();showUploadingToast(toastId);closeModal();selectedFile=null;
  let res;
  try{
    if(isSticky){const body={title,content:stickyData,category};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}
    else if(uploadFile){try{const blobResult=await uploadToBlobs(uploadFile,pct=>{const el=document.getElementById(toastId);if(el)el.innerHTML='<div class="toast-spinner"></div> 上传中... '+pct+'%'});const body={title,content:fileContent,category,fileKey:blobResult.key,fileName:blobResult.fileName,fileType:blobResult.fileType,fileSize:blobResult.fileSize};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}catch(directErr){const form=new FormData();form.append("title",title);form.append("content",fileContent);form.append("category",category);form.append("file",uploadFile,uploadFile.name);const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await uploadWithProgress(u,m,form)}}

    else{let content=fileContent;const body={title,content,category};if(mode==="edit"){const ex=allItems.find(i=>i.id===id);if(ex){body.fileData=ex.fileData||null;body.fileName=ex.fileName;body.fileType=ex.fileType;body.fileSize=ex.fileSize}}const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}
    if(!res.ok){const e=await res.json();throw new Error(e.error||"操作失败")}
    const saved=await res.json();removeToast(toastId);
    if(mode==="create"){allItems.unshift(saved)}else{const idx=allItems.findIndex(i=>i.id===id);if(idx>=0)Object.assign(allItems[idx],saved)}
    updateCounts();loadStats();renderItems(allItems);toast(mode==="create"?"创建成功！":"更新成功！","success");
  }catch(e){removeToast(toastId);toast(e.message,"error")}
}
function uploadWithProgress(url,method,formData){return new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open(method,"/api"+url);if(AUTH_TOKEN)xhr.setRequestHeader("Authorization","Bearer "+AUTH_TOKEN);xhr.upload.onprogress=e=>{if(e.lengthComputable){const pct=Math.round(e.loaded/e.total*100);const bar=document.getElementById("uploadFill");const txt=document.getElementById("uploadText");if(bar)bar.style.width=pct+"%";if(txt)txt.textContent=pct+"%"}};xhr.onload=()=>{try{const data=JSON.parse(xhr.responseText);resolve({ok:xhr.status>=200&&xhr.status<300,json:()=>Promise.resolve(data),status:xhr.status})}catch(e){resolve({ok:xhr.status>=200&&xhr.status<300,json:()=>Promise.resolve({}),status:xhr.status})}};xhr.onerror=()=>reject(new Error("网络错误"));xhr.send(formData)})}
function showUploadingToast(id){const c=document.getElementById("toastContainer");const el=document.createElement("div");el.id=id;el.className="toast toast-info";el.innerHTML='<div class="toast-spinner"></div> 正在上传，请稍候...';c.appendChild(el)}
function removeToast(id){const el=document.getElementById(id);if(el)el.remove()}

// ============================================================
// 🗑️ 删除
// ============================================================
function confirmDelete(id){const c=document.getElementById("modalContainer");c.innerHTML='<div class="confirm-overlay"><div class="confirm-dialog"><h3>确认删除</h3><p>删除后不可恢复，确定要删除吗？</p><div class="confirm-actions"><button class="btn btn-secondary" onclick="closeModal()">取消</button><button class="btn btn-danger" onclick="deleteItem(\''+id+'\')">确认删除</button></div></div></div>'}
async function deleteItem(id){try{const res=await apiFetch("/items/"+id,{method:"DELETE"});if(!res.ok)throw new Error("删除失败");closeModal();allItems=allItems.filter(i=>i.id!==id);updateCounts();loadStats();renderItems(allItems);toast("已删除","success")}catch(e){toast(e.message,"error")}}
function closeModal(){document.getElementById("modalContainer").innerHTML="";selectedFile=null;const bar=document.getElementById("uploadProgress");if(bar)bar.style.display="none"}

// ============================================================
// 🔧 工具函数
// ============================================================
function toast(msg,type){const c=document.getElementById("toastContainer");const el=document.createElement("div");el.className="toast "+type;el.textContent=msg;c.appendChild(el);setTimeout(()=>{el.style.opacity="0";el.style.transition="opacity .3s";setTimeout(()=>el.remove(),300)},2500)}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function escAttr(s){return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function fmtDate(d){if(!d)return"";return new Date(d).toLocaleDateString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
function formatSize(b){if(!b)return"0 B";const u=["B","KB","MB","GB"];let i=0;while(b>=1024&&i<3){b/=1024;i++}return b.toFixed(1)+" "+u[i]}

// ============================================================
// 🔄 自动登录 - 刷新后恢复会话
// ============================================================
(async function init(){
  if(AUTH_TOKEN){const valid=await checkAuth();if(valid){showMainApp();return}}
  document.getElementById("loginScreen").style.display="flex";document.getElementById("mainApp").style.display="none";
})();
