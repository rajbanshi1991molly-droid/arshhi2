// api/login.js
import { Redis } from '@upstash/redis';

// Safe instantiation for Vercel Serverless environment
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Direct CORS headers to ensure the static frontend can communicate cleanly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    // Looks up the password string matching the user key in your Upstash database
    const dbPassword = await redis.get(`user:${username}`);

    if (dbPassword && dbPassword === password) {
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        token: 'auth_session_' + Buffer.from(username).toString('base64') 
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Database connection error', details: error.message });
  }
}
