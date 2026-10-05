// api/login.js
const { userOk, passwordOk, json, newToken } = require('./_lib');

module.exports = async (req, res) => {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method' });
  }

  try {
    const b = req.body || {};
    
    // 2. Check if the username and password match your Vercel Edge Config values
    const isValidUser = userOk(b.username);
    const isValidPassword = await passwordOk(String(b.password || ''));

    if (!isValidUser || !isValidPassword) {
      return json(res, 401, { error: 'wrong' });
    }

    // 3. If correct, generate and return the session token your admin.html expects
    return json(res, 200, newToken());

  } catch (e) {
    console.error("Login script error:", e);
    return json(res, 500, { error: 'server' });
  }
};
