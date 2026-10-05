// api/_lib.js
const { createClient } = require('@vercel/edge-config');

// This automatically connects to the password you just saved in your Vercel Dashboard!
const edgeConfig = createClient(process.env.EDGE_CONFIG);

function userOk(username) {
  // Checks if the username typed matches "admin" (change this to whatever you want)
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  try {
    // Looks up the password you typed into Vercel's store in Step 2
    const correctPassword = await edgeConfig.get('password');
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Config error:", error);
    return false;
  }
}

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

function newToken() {
  return { ok: true, token: 'arshhi-secure-session-token' };
}

module.exports = { userOk, passwordOk, json, newToken };
