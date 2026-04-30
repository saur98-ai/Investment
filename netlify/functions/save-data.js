const { getStore } = require('@netlify/blobs');

// Change this password in GitHub to update admin access
const ADMIN_SECRET = 'Akshay@Surbhi';

const ALLOWED_KEYS = ['contact', 'testimonials', 'blogs', 'settings'];

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors() };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Auth: check ADMIN_SECRET
  const provided = (event.headers['authorization'] || '').replace('Bearer ', '').trim();
  if (provided !== ADMIN_SECRET) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Auth ping — just confirms secret is correct, no write
  if (body._ping) {
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
  }

  const { key, data } = body;

  if (!key || !ALLOWED_KEYS.includes(key) || data === null || data === undefined) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid key or data' }) };
  }

  try {
    const store = getStore('admin-data');
    await store.set(key, JSON.stringify(data));
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Blob save error:', err);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: err.message }) };
  }
};

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}
