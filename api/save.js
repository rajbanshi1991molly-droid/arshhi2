// api/save.js
const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  // Establish clean cross-origin connection headers for your admin form
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'method' });
  }

  try {
    const updatedSiteData = req.body || {};

    // 1. Instantly save all your fields, beauty services, and reviews into Redis
    await kv.set('arshhi_site_data', updatedSiteData);

    // 2. Return a clean, successful status block back to your admin.html script
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ ok: true, success: true });

  } catch (error) {
    console.error("Database Save Failure:", error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'server', details: error.message });
  }
};
