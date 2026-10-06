// api/save.js
const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Setup safe connection rules for your front-end forms script
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // 1. Instantly save all your fields, beauty services, and reviews into Redis
      await kv.set('arshhi_site_data', req.body);
      
      // 2. Return a clean, successful status block matching what your admin.html checks for
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ status: 200, success: true, ok: true });
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ status: 500, error: 'server', details: error.message });
  }
};
