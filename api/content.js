// api/content.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET Request: Fetches data to display on the index/admin pages
  if (req.method === 'GET') {
    try {
      const pageContent = await redis.get('site:content');
      return res.status(200).json(pageContent || { message: "No content initialized yet." });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch content', details: error.message });
    }
  }

  // POST Request: Executed when the admin clicks "Save" or "Update"
  if (req.method === 'POST') {
    try {
      const { contentData } = req.body;

      if (!contentData) {
        return res.status(400).json({ error: 'No data provided to save' });
      }

      // Overwrites or creates the application state JSON string in Upstash
      await redis.set('site:content', contentData);
      return res.status(200).json({ success: true, message: 'Content saved successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save content', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
