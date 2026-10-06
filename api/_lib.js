// api/_lib.js
const { kv } = require('@vercel/kv');

function userOk(username) {
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  try {
    const correctPassword = await kv.get('arshhi:pw');
    if (!correctPassword) {
      return typedPassword === 'admin123';
    }
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Redis connection error:", error);
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
