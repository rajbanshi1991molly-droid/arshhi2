// api/content.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Default fallback layout if your database is empty
  const defaultData = {
    brand: "Arshhi",
    tagline: "Door to door beauty care",
    logo: "",
    reviews: []
  };

  try {
    // If the admin dashboard panel hits save (POST)
    if (req.method === 'POST') {
      const updatedData = req.body;
      await kv.set('arshhi_site_data', updatedData);
      return res.status(200).json({ success: true });
    }

    // If the public homepage loads your content (GET)
    if (req.method === 'GET') {
      const storedData = await kv.get('arshhi_site_data');
      return res.status(200).json(storedData || defaultData);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
