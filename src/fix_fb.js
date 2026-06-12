const fs = require("fs");
let app = fs.readFileSync("src/app.js", "utf-8");

// Replace the direct upload branch with FormData fallback
// Current: uploadToBlobs then send metadata
// Fix: try direct upload, fall back to FormData
const oldBranch = `else if(uploadFile){const blobResult=await uploadToBlobs(uploadFile,pct=>{const el=document.getElementById(toastId);if(el)el.innerHTML='<div class="toast-spinner"></div> 上传中... '+pct+'%'});const body={title,content:fileContent,category,fileKey:blobResult.key,fileName:blobResult.fileName,fileType:blobResult.fileType,fileSize:blobResult.fileSize};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}`;

const newBranch = `else if(uploadFile){try{const blobResult=await uploadToBlobs(uploadFile,pct=>{const el=document.getElementById(toastId);if(el)el.innerHTML='<div class="toast-spinner"></div> 上传中... '+pct+'%'});const body={title,content:fileContent,category,fileKey:blobResult.key,fileName:blobResult.fileName,fileType:blobResult.fileType,fileSize:blobResult.fileSize};const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await apiFetch(u,{method:m,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}catch(directErr){const form=new FormData();form.append("title",title);form.append("content",fileContent);form.append("category",category);form.append("file",uploadFile,uploadFile.name);const u=mode==="create"?"/items":"/items/"+id;const m=mode==="create"?"POST":"PUT";res=await uploadWithProgress(u,m,form)}`;

if (app.includes(oldBranch)) {
  app = app.replace(oldBranch, newBranch);
  console.log("Added FormData fallback for file upload");
} else {
  console.log("ERROR: old branch not found");
}

// Also update the limit to 5MB (Netlify constraint)
app = app.replace(/20\*1024\*1024/g, "5*1024*1024");
app = app.replace(/文件不能超过20MB/g, "文件不能超过5MB");

fs.writeFileSync("src/app.js", app, "utf-8");
try { new Function(app); console.log("Syntax: OK"); } catch(e) { console.log("Syntax:", e.message); }