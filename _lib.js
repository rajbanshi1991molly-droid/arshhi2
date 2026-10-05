const crypto = require('crypto');

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SESSION_MS = 12 * 60 * 60 * 1000;

async function redis(cmd) {
  if (!DB_URL || !DB_TOKEN) throw new Error('no_db');
  const r = await fetch(DB_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + DB_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

function sign(exp) {
  const p = String(exp);
  return p + '.' + crypto.createHmac('sha256', process.env.SESSION_SECRET).update(p).digest('base64url');
}
function newToken() {
  const exp = Date.now() + SESSION_MS;
  return { token: sign(exp), expires: exp };
}
function authed(req) {
  if (!process.env.SESSION_SECRET) return false;
  const h = String(req.headers.authorization || '');
  if (!h.startsWith('Bearer ')) return false;
  const t = h.slice(7), exp = parseInt(t.split('.')[0], 10);
  if (!exp || exp < Date.now()) return false;
  const good = sign(exp);
  return t.length === good.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(good));
}

function hashPw(pw) {
  const salt = crypto.randomBytes(16);
  return salt.toString('hex') + ':' + crypto.scryptSync(pw, salt, 32).toString('hex');
}
function checkHash(pw, stored) {
  const [s, h] = String(stored).split(':');
  const a = crypto.scryptSync(pw, Buffer.from(s, 'hex'), 32), b = Buffer.from(h, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function sameText(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}
// A password saved from the admin panel (in the database) wins over the ADMIN_PASSWORD setting.
async function passwordOk(pw) {
  const stored = await redis(['GET', 'arshhi:pw']);
  if (stored) return checkHash(pw, stored);
  return !!process.env.ADMIN_PASSWORD && sameText(pw, process.env.ADMIN_PASSWORD);
}
function userOk(u) {
  return String(u || '').trim().toLowerCase() === String(process.env.ADMIN_USER || 'admin').toLowerCase();
}
function json(res, code, obj) {
  res.status(code).setHeader('Cache-Control', 'no-store').json(obj);
}
module.exports = { redis, newToken, authed, hashPw, passwordOk, userOk, json, sameText };
