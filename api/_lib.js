// api/_lib.js
function userOk(username) {
  return username === 'admin'; 
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

module.exports = { userOk, json, newToken };
