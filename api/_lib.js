// api/_lib.js

function userOk(username) {
  // Replace 'admin' with your desired username if you want
  return username === 'admin'; 
}

async function passwordOk(typedPassword) {
  // REPLACE 'yourSecretPassword123' WITH THE EXACT PASSWORD YOU WANT TO USE
  const correctPassword = '12345678';
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
