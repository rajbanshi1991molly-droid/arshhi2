// api/login.js
const { configured, json, userOk, passwordOk, newToken, isBlocked, recordFail, clearFails } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (!configured()) return json(res, 500, { error: 'setup' });
  try {
    if (await isBlocked(req)) return json(res, 429, { error: 'blocked' });
    const b = req.body || {};
    const okUser = userOk(String(b.username || ''));
    const okPass = await passwordOk(String(b.password || ''));
    if (okUser && okPass) {
      await clearFails(req);
      return json(res, 200, newToken());
    }
    await recordFail(req);
    json(res, 401, { error: 'wrong' });
  } catch (e) {
    console.error('login failed:', e);
    json(res, 500, { error: 'server' });
  }
};
