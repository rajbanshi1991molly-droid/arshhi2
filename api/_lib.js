// api/_lib.js

function userOk(username) {
  // Checks if the typed username matches "admin"
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  // Directly reads the ADMIN_PASSWORD environment variable you set in Vercel!
  const correctPassword = process.env.ADMIN_PASSWORD;
  return typedPassword === correctPassword;
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
