// api/_lib.js - shared helpers (Upstash Redis, login tokens, password check)
const crypto = require('crypto');
const { Redis } = require('@upstash/redis');

// Accepts either naming scheme (Upstash direct, or the Vercel "KV_" names)
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN_ = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = URL_ && TOKEN_ ? new Redis({ url: URL_, token: TOKEN_ }) : null;

const KEY_CONTENT = 'site:content';   // the website data (read by index.html, written by admin)
const KEY_PW = 'site:pw';             // hashed password set from the admin panel
const SESSION_MS = 12 * 60 * 60 * 1000;

function configured() {
  return !!(redis && process.env.SESSION_SECRET);
}

function json(res, status, data) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(data);
}

function sha(s) {
  return crypto.createHash('sha256').update(String(s)).digest();
}
function safeEq(a, b) {
  return crypto.timingSafeEqual(sha(a), sha(b));
}

function userOk(username) {
  return safeEq(username || '', process.env.ADMIN_USER || 'admin');
}

function hashPw(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return salt + ':' + hash;
}
function verifyPw(pw, stored) {
  const parts = String(stored).split(':');
  if (parts.length !== 2) return false;
  const hash = crypto.scryptSync(String(pw), parts[0], 64);
  const want = Buffer.from(parts[1], 'hex');
  return want.length === hash.length && crypto.timingSafeEqual(hash, want);
}

// Password saved from the admin panel wins; otherwise ADMIN_PASSWORD is used.
async function passwordOk(typed) {
  const stored = await redis.get(KEY_PW);
  if (stored) return verifyPw(typed, stored);
  const first = process.env.ADMIN_PASSWORD;
  return !!first && safeEq(typed, first);
}

// Signed session token: base64url(payload).hmac
function sign(payload) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
}
function newToken() {
  const expires = Date.now() + SESSION_MS;
  const payload = Buffer.from(JSON.stringify({ exp: expires })).toString('base64url');
  return { ok: true, token: payload + '.' + sign(payload), expires };
}
function authed(req) {
  try {
    if (!process.env.SESSION_SECRET) return false;
    const h = req.headers.authorization || '';
    if (h.slice(0, 7) !== 'Bearer ') return false;
    const [payload, sig] = h.slice(7).split('.');
    if (!payload || !sig) return false;
    if (!safeEq(sig, sign(payload))) return false;
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > Date.now();
  } catch (e) {
    return false;
  }
}

// Login throttle: 8 wrong attempts -> blocked for 15 minutes per IP
function ipKey(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim();
  return 'site:fails:' + ip;
}
async function isBlocked(req) {
  const n = await redis.get(ipKey(req));
  return Number(n || 0) >= 8;
}
async function recordFail(req) {
  const k = ipKey(req);
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, 900);
}
async function clearFails(req) {
  await redis.del(ipKey(req));
}

module.exports = {
  redis, KEY_CONTENT, KEY_PW, configured, json,
  userOk, passwordOk, hashPw, newToken, authed,
  isBlocked, recordFail, clearFails
};
