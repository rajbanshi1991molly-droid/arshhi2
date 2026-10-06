//api/save.js
const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  //Set up safe connection rules for your original admin.html scripts
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // 1. Instantly write all your styled layout modifications straight into Redis storage
      await kv.set('arshhi_site_data', req.body);
      
      // 2. Clear out response data properties to return a clean HTTP status code
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({});
    }
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'server', details: error.message });
  }
};
