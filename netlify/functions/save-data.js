const { getStore } = require('@netlify/blobs');

const ALLOWED_KEYS = ['contact', 'testimonials', 'blogs'];

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors() };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Auth: check ADMIN_SECRET env var
  const authHeader = event.headers['authorization'] || '';
  const provided = authHeader.replace('Bearer ', '').trim();
  const secret = process.env.ADMIN_SECRET;

  if (!secret || provided !== secret) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { key, data } = body;

  if (!key || !ALLOWED_KEYS.includes(key)) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid key' }) };
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
