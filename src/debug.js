const fs = require('fs');
const src = __dirname;
const htmlJs = fs.readFileSync(src + '/html.js', 'utf-8');
const match = htmlJs.match(/export const HTML = "(.*)";$/s);
const html = JSON.parse('"' + match[1] + '"');
const jsMatch = html.match(/<script>([\s\S]*)<\/script>/);
const js = jsMatch[1];

// Search for problematic patterns
// 1. Look for ),)  or ) }
let problematic = [];
const lines = js.split('\n');
lines.forEach((line, i) => {
  // Check for unbalanced parens on a single line (simple heuristic)
  const open = (line.match(/\(/g) || []).length;
  const close = (line.match(/\)/g) || []).length;
  const diff = close - open;
  if (Math.abs(diff) > 3) {
    problematic.push({ line: i + 1, diff, code: line.substring(0, 120) });
  }
});

if (problematic.length) {
  console.log('Potentially problematic lines (paren diff > 3):');
  problematic.forEach(p => console.log('  Line', p.line, '(diff=' + p.diff + ')', p.code));
}

// 2. Search for ),) or ) ) or )}  patterns that might be issues
const badPatterns = lines.filter((l, i) => {
  return l.includes('),)') || l.includes(') )') && l.trim().endsWith(')');
});
if (badPatterns.length) {
  console.log('\nBad comma patterns:');
  badPatterns.forEach((l, i) => console.log('  ', l.substring(0, 100)));
}

// 3. Check for remaining doLogin-related artifacts
const doLoginLines = lines.filter(l => l.includes('doLogin') || l.includes('toggleLoginPw') || l.includes('setToken'));
console.log('\ndoLogin-related lines:');
doLoginLines.forEach(l => console.log('  ', l.substring(0, 120)));
