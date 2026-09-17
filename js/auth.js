/* ============================================================
   auth.js — Owner Mode gate
   The owner password is a single hash baked into owner-config.js
   (OWNER_PASSWORD_HASH) — the same for every browser and device,
   because it ships with the site's files instead of living in
   this browser's localStorage. "Login" just checks the password
   typed against that hash; "session unlock" (sessionStorage) is
   only remembered for this browser tab, same as before.
   This is still client-side only — good enough to keep casual
   visitors off the editable dashboard, not a substitute for real
   server-side authentication.
   ============================================================ */

const SESSION_KEY = 'mcp_owner_session';

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isOwnerUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}
function markOwnerUnlocked() { sessionStorage.setItem(SESSION_KEY, '1'); }
function lockOwnerMode() { sessionStorage.removeItem(SESSION_KEY); }

function hasPasswordConfigured() {
  return typeof OWNER_PASSWORD_HASH === 'string' && OWNER_PASSWORD_HASH.length === 64;
}

async function checkPassword(pw) {
  if (!hasPasswordConfigured()) return false;
  const hash = await sha256(pw);
  return hash === OWNER_PASSWORD_HASH;
}

async function hashForNewPassword(pw) {
  return sha256(pw);
}

window.Auth = {
  isOwnerUnlocked, markOwnerUnlocked, lockOwnerMode,
  hasPasswordConfigured, checkPassword, hashForNewPassword,
};
