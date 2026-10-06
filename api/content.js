// api/content.js
const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  // Setup safe connection rules for your front-end forms script
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Accepts data from your save button, ignores token hurdles, and writes to Redis
    if (req.method === 'POST') {
      await kv.set('arshhi_site_data', req.body);
      
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ ok: true, success: true, status: 200 });
    }

    // 2. Serves data back to your homepage to display it
    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(storedData || {});
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'server', details: error.message });
  }
};
