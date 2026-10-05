// api/content.js - PUBLIC, read-only. index.html and admin.html load the site data from here.
const { redis, KEY_CONTENT, json } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'method' });
  if (!redis) return json(res, 500, { error: 'setup' });
  try {
    let data = await redis.get(KEY_CONTENT);
    if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { data = null; } }
    // Nothing saved yet: 404 so the pages keep using the data built into index.html
    if (!data || typeof data !== 'object') return json(res, 404, { error: 'empty' });
    json(res, 200, data);
  } catch (e) {
    console.error('content read failed:', e);
    json(res, 500, { error: 'server' });
  }
};
