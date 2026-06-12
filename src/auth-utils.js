// ============================================================
// 共享认证工具 — Worker & Netlify Function 共用
// ============================================================

// PBKDF2 密码哈希 (Web Crypto API)
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 200000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// 生成随机盐
function generateSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2,'0')).join('');
}

// 生成会话令牌
function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2,'0')).join('');
}

// 默认凭证
const DEFAULT_USERNAME = 'rsn';
const DEFAULT_PASSWORD = '131420';

export { hashPassword, generateSalt, generateToken, DEFAULT_USERNAME, DEFAULT_PASSWORD };
