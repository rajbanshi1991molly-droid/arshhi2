const { redis, authed, json } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (!authed(req)) return json(res, 401, { error: 'auth' });
  const d = req.body;
  if (!d || typeof d !== 'object' || typeof d.brand !== 'string' || !Array.isArray(d.services) || !Array.isArray(d.steps))
    return json(res, 400, { error: 'invalid' });
  const s = JSON.stringify(d);
  if (s.length > 900000) return json(res, 413, { error: 'too_large' });
  try {
    await redis(['SET', 'arshhi:content', s]);
    json(res, 200, { ok: true });
  } catch (e) {
    json(res, 500, { error: 'server' });
  }
};
