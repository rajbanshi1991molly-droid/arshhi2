// api/password.js - admin only. Stores a hashed password in Redis.
const { redis, KEY_PW, json, authed, passwordOk, hashPw } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (!authed(req)) return json(res, 401, { error: 'auth' });
  const b = req.body || {};
  const next = String(b.next || '');
  if (next.length < 8) return json(res, 400, { error: 'short' });
  try {
    if (!(await passwordOk(String(b.current || '')))) return json(res, 403, { error: 'wrong_current' });
    await redis.set(KEY_PW, hashPw(next));
    json(res, 200, { ok: true });
  } catch (e) {
    console.error('password change failed:', e);
    json(res, 500, { error: 'server' });
  }
};
