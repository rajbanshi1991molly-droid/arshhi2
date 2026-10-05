// api/content.js
const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const defaultData = {
    brand: "Arshhi",
    tagline: "Door to door beauty care",
    logo: "",
    reviews: []
  };

  try {
    if (req.method === 'POST') {
      const updatedData = req.body;
      await kv.set('arshhi_site_data', updatedData);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      return res.status(200).json(storedData || defaultData);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
