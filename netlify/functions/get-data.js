const { getStore } = require('@netlify/blobs');

const DEFAULTS = {
  contact: {
    phone: '9827599966',
    email: 'yourmail@gmail.com',
    whatsapp: '919827599966',
    waMsg: 'Hi Akshay, I am interested in your financial services.',
    kotak: 'https://www.kotaksecurities.com/landing-page/franchisee/open-demat-account-partner-madhu-maheshwari-neo',
    instagram: '', linkedin: '', facebook: ''
  },
  testimonials: { items: [] },
  blogs: { items: [] }
};

exports.handler = async (event) => {
  const key = (event.queryStringParameters || {}).key;

  if (!key || !DEFAULTS[key]) {
    return { statusCode: 400, body: 'Invalid key. Use: contact, testimonials, or blogs' };
  }

  try {
    const store = getStore('admin-data');
    const data = await store.get(key, { type: 'json' });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(data !== null ? data : DEFAULTS[key])
    };
  } catch (err) {
    // Blobs not yet initialised — return defaults silently
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(DEFAULTS[key])
    };
  }
};
