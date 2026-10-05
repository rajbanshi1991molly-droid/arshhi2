// api/_lib.js
const { createClient } = require('@vercel/global-config');

// Connects directly to the Global Config store connected to your project dashboard
const configClient = createClient(process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG);

function userOk(username) {
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  try {
    // Reads the precise "password" key you saved in the dashboard JSON box
    const correctPassword = await configClient.get('password');
    return typedPassword === correctPassword;
  } catch (error) {
    console.error("Config reading error:", error);
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
