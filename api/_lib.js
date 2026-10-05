// api/_lib.js
const { kv } = require('@vercel/kv');

// Standard plain username validation check
function userOk(username) {
  return username === 'admin'; 
}

// Securely queries your Vercel KV / Redis database to verify the password string
async function passwordOk(typedPassword) {
  try {
    // 1. Fetches the password you previously stored in your Redis database
    const correctPassword = await kv.get('arshhi:pw');
    
    // 2. If the database is empty, fall back to a default password so you can get in the first time
    if (!correctPassword) {
      return typedPassword === 'admin123';
    }
    
    // 3. Otherwise, check if what you typed matches the database string
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Redis data link error:", error);
    return false;
  }
}

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

function newToken() {
  return { 
    ok: true, 
    token: 'arshhi-secure-session-token',
    expires: Date.now() + 3600000 
  };
}

module.exports = { userOk, passwordOk, json, newToken };
