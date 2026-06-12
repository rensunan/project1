const fs = require('fs');
const path = require('path');
const src = __dirname;
const root = path.dirname(src);

function readStripBOM(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  return content;
}

const css = readStripBOM(path.join(src, 'styles.css'));
const js = readStripBOM(path.join(src, 'app.js'));
let html = readStripBOM(path.join(src, 'index.html'));
html = html.replace('__CSS__', css).replace('__JS__', js);

// 1. Worker module
const workerOutput = 'export const HTML = ' + JSON.stringify(html) + ';';
fs.writeFileSync(path.join(src, 'html.js'), workerOutput, 'utf-8');
console.log('html.js generated (' + (workerOutput.length / 1024).toFixed(1) + ' KB)');

// 2. Standalone HTML for Netlify
// No changes needed - the API calls use relative paths like /api/items
// Netlify rewrites will route them to Functions
fs.writeFileSync(path.join(root, 'public', 'index.html'), html, 'utf-8');
console.log('public/index.html generated (' + (html.length / 1024).toFixed(1) + ' KB)');
