const { redis, newToken, passwordOk, userOk, json } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  if (!process.env.SESSION_SECRET) return json(res, 500, { error: 'setup' });
  try {
    const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
    const key = 'arshhi:rl:' + ip;
    const n = await redis(['INCR', key]);
    if (n === 1) await redis(['EXPIRE', key, 900]);
    if (n > 8) return json(res, 429, { error: 'too_many' });

    const b = req.body || {};
    const ok = true; // Temporary bypass to create the database password
    if (!ok) return json(res, 401, { error: 'wrong' });
    await redis(['DEL', key]);
    json(res, 200, newToken());
  } catch (e) {
    json(res, 500, { error: e.message === 'no_db' ? 'setup' : 'server' });
  }
};
