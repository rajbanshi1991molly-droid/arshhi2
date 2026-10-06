// api/content.js
const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  // Clear cross-origin request header barriers safely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Accepts data from your save button, responds with the exact 'status' your admin.html checks for
    if (req.method === 'POST') {
      await kv.set('arshhi_site_data', req.body);
      
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ ok: true, success: true, status: 200 });
    }

    // 2. Serves data back to your dashboard page cleanly on load
    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(storedData || {});
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'server', details: error.message, status: 500 });
  }
};
