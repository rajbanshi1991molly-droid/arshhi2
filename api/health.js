// api/health.js - open https://YOUR-SITE/api/health to see what is wrong with the setup.
// Shows only yes/no answers, never any secret. You can delete this file when everything works.
const { redis, KEY_CONTENT, KEY_PW, json } = require('./_lib');

module.exports = async (req, res) => {
  const out = {
    database_variables_found: !!redis,
    SESSION_SECRET_set: !!process.env.SESSION_SECRET,
    ADMIN_USER_set: !!process.env.ADMIN_USER,
    ADMIN_PASSWORD_set: !!String(process.env.ADMIN_PASSWORD || '').trim(),
    database_connection: 'not tested',
    website_content_saved: null,
    password_saved_in_database: null
  };
  if (redis) {
    try {
      await redis.ping();
      out.database_connection = 'ok';
      out.website_content_saved = !!(await redis.get(KEY_CONTENT));
      out.password_saved_in_database = !!(await redis.get(KEY_PW));
    } catch (e) {
      out.database_connection = 'FAILED: ' + String((e && e.message) || e).slice(0, 120);
    }
  }
  const problems = [];
  if (!out.database_variables_found) problems.push('No database variables. Connect Upstash to the project (Storage tab) or add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  if (!out.SESSION_SECRET_set) problems.push('Add SESSION_SECRET (40+ random characters).');
  if (!out.ADMIN_PASSWORD_set && !out.password_saved_in_database) problems.push('Add ADMIN_PASSWORD.');
  if (out.database_connection.indexOf('FAILED') === 0) problems.push('Database variables exist but the connection failed. Re-copy the URL and token from Upstash.');
  out.problems = problems.length ? problems : ['none found'];
  json(res, 200, out);
};
