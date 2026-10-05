// api/content.js
const { kv } = require('@vercel/kv');
const { json } = require('./_lib');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Receives data from your admin panel save button and stores it
    if (req.method === 'POST') {
      await kv.set('arshhi_site_data', req.body);
      return json(res, 200, { success: true });
    }

    // 2. Serves data to your dashboard and index fields
    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      return json(res, 200, storedData || {});
    }
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
};
