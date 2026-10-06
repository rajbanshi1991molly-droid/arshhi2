// api/login.js
const { userOk, passwordOk, json, newToken } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method' });
  }

  try {
    const b = req.body || {};
    
    const isValidUser = userOk(b.username);
    const isValidPassword = await passwordOk(String(b.password || ''));

    if (!isValidUser || !isValidPassword) {
      return json(res, 401, { error: 'wrong' });
    }

    return json(res, 200, newToken());

  } catch (e) {
    return json(res, 500, { error: 'server', details: e.message });
  }
};
