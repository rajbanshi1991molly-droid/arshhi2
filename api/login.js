// api/login.js
module.exports = async (req, res) => {
  // Allow your admin.html frontend to talk to this endpoint safely
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const b = req.body || {};
    
    // HARDCODE YOUR PASSWORD DIRECTLY HERE FOR A FOOLPROOF FIX
    const correctUser = "admin";
    const correctPassword = "yourSecretPassword123"; // <-- Type the exact password you want to use here!

    if (b.username === correctUser && b.password === correctPassword) {
      return res.status(200).json({
        ok: true,
        token: 'arshhi-secure-session-token',
        expires: Date.now() + 3600000 // Valid for 1 hour
      });
    } else {
      return res.status(401).json({ error: 'wrong' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
