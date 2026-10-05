// api/content.js
const { json } = require('./_lib');

// Global temporary in-memory store for your content layout edits
let cachedSiteData = {
  brand: "Arshhi",
  tagline: "Door to door beauty care",
  logo: "",
  reviews: []
};

module.exports = async function handler(req, res) {
  // Allow your admin.html frontend layout to talk to this endpoint safely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle saving updates (POST) from your administrative input boxes
    if (req.method === 'POST') {
      cachedSiteData = req.body;
      return json(res, 200, { success: true });
    }

    // Handle fetching content (GET) to fill your dashboard text fields
    if (req.method === 'GET') {
      return json(res, 200, cachedSiteData);
    }
    
    return json(res, 405, { error: 'Method not allowed' });

  } catch (error) {
    return json(res, 500, { error: error.message });
  }
};
