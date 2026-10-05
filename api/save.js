// api/save.js
const { kv } = require('@vercel/kv');
const { json } = require('./_lib');

module.exports = async (req, res) => {
  // Safe CORS Configuration headers for your save panel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method' });
  }

  try {
    const updatedSiteData = req.body || {};

    // 1. Permanently save your text fields, service boxes, and client reviews into Redis
    await kv.set('arshhi_site_data', updatedSiteData);

    // 2. Return a clean success status response back to your admin.html form script
    return json(res, 200, { ok: true, success: true });

  } catch (error) {
    console.error("Database Save Failure:", error);
    return json(res, 500, { error: 'server', details: error.message });
  }
};
