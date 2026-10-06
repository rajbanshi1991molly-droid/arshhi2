// api/login.js
module.exports = async (req, res) => {
  // Setup safe connection rules for your admin interface
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ error: 'method' });
  }

  try {
    const b = req.body || {};
    
    // 1. Explicitly sets your required login details
    const correctUser = "admin";
    const correctPassword = "admin123";

    // 2. Checks if what you typed in the box matches exactly
    const isValidUser = (b.username === correctUser);
    const isValidPassword = (String(b.password || '') === correctPassword);

    if (!isValidUser || !isValidPassword) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: 'wrong' });
    }

    // 3. Issues the exact session tokens your admin.html needs to open up
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      ok: true,
      token: 'arshhi-secure-session-token',
      expires: Date.now() + 3600000 // Valid session for 1 hour
    });

  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'server', details: e.message });
  }
};
