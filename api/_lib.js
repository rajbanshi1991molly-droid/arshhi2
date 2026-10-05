// api/_lib.js
const { createClient } = require('@vercel/edge-config');

// Connect to Vercel's global vault
const edgeConfig = createClient(process.env.EDGE_CONFIG);

function userOk(username) {
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  try {
    const correctPassword = await edgeConfig.get('password');
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Database reading issue:", error);
    return false;
  }
}

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

// Generate the specific token object your admin.html checks for
function newToken() {
  return { 
    ok: true, 
    token: 'arshhi-secure-session-token',
    expires: Date.now() + 3600000 // Valid for 1 hour
  };
}

module.exports = { userOk, passwordOk, json, newToken };
