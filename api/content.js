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
    // Saves updates from your text boxes straight into Vercel Storage
    if (req.method === 'POST') {
      await kv.set('arshhi_site_data', req.body);
      return json(res, 200, { success: true });
    }

    // Fetches your saved database texts to keep them visible
    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      return json(res, 200, storedData || {});
    }
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
};
