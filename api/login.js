// api/login.js
const { kv } = require('@vercel/kv');
const { userOk, json, newToken } = require('./_lib');

module.exports = async (req, res) => {
  // Safe CORS Headers configuration rules
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method' });
  }

  try {
    const b = req.body || {};
    
    // 1. Verify standard username string rules match
    if (!userOk(b.username)) {
      return json(res, 401, { error: 'wrong' });
    }

    // 2. Securely check the master password inside your Vercel KV / Redis database instance
    const correctPassword = await kv.get('arshhi:pw');
    const typedPassword = String(b.password || '');

    // 3. Fallback Initial Setup Rule: If your Redis database is brand new and completely empty,
    // let the user log in using 'admin123' so they can set a permanent password.
    if (!correctPassword) {
      if (typedPassword === 'admin123') {
        return json(res, 200, newToken());
      } else {
        return json(res, 401, { error: 'wrong' });
      }
    }

    // 4. Standard validation loop if password database entries exist
    if (typedPassword === correctPassword) {
      return json(res, 200, newToken());
    } else {
      return json(res, 401, { error: 'wrong' });
    }

  } catch (error) {
    console.error("Vercel Function Handshake Error:", error);
    return json(res, 500, { error: 'server', details: error.message });
  }
};
