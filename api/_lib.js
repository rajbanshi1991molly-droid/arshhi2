// api/_lib.js
const { kv } = require('@vercel/kv');

function userOk(username) {
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  try {
    // Queries your connected Vercel Redis instance for your password string
    const correctPassword = await kv.get('arshhi:pw');
    
    // Fallback default password so you can get into the panel for the first time
    if (!correctPassword) {
      return typedPassword === 'admin123';
    }
    
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Redis read error:", error);
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
