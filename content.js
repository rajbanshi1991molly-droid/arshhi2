const { redis, json } = require('./_lib');

// Public: the website reads its content here.
module.exports = async (req, res) => {
  try {
    const v = await redis(['GET', 'arshhi:content']);
    if (!v) return json(res, 404, { error: 'not_set' });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', req.query && req.query.fresh ? 'no-store' : 's-maxage=10, stale-while-revalidate=30');
    res.status(200).send(v);
  } catch (e) {
    json(res, 500, { error: 'server' });
  }
};
