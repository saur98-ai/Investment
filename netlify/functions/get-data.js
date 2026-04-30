const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  contact: {
    phone: '9827599966',
    email: 'saurabhmaheshwaritest@gmail.com',
    whatsapp: '919827599966',
    waMsg: 'Hi Akshay, I am interested in your financial services.',
    kotak: 'https://www.kotaksecurities.com/landing-page/franchisee/open-demat-account-partner-madhu-maheshwari-neo',
    instagram: '', linkedin: '', facebook: ''
  },
  testimonials: { items: [] },
  blogs: { items: [] },
  settings: {
    services: {
      sSip:true, sStock:true, sPms:true, sBonds:true, sAif:true, sPrivateEquity:true,
      sInsurance:true, sWill:true, sTrust:true, sEstatePlanning:true,
      sRetirement:true, sSuccessionPlanning:true,
      sInternational:true, sGiftCity:true, sUnlisted:true,
      sLoan:true, sDebtFinancing:true, sEquityFinancing:true, sExitPlanning:true,
      sFamilyOffice:true, sElite:true
    },
    calculators: {
      sip:true, lumpsum:true, stepup:true,
      goal:true, goalplanner:true, retirement:true, delay:true,
      swp:true, emi:true, insurance:true
    }
  }
};

exports.handler = async (event) => {
  const key = (event.queryStringParameters || {}).key;

  if (!key || !DEFAULTS[key]) {
    return { statusCode: 400, body: 'Invalid key. Use: contact, testimonials, blogs, or settings' };
  }

  let data = null;

  // 1. Try Netlify Blobs first (admin-saved data)
  try {
    const store = getStore('admin-data');
    const raw = await store.get(key);
    if (raw !== null) data = JSON.parse(raw);
  } catch (_) {}

  // 2. Fall back to static data/ JSON file if Blobs has nothing
  if (data === null) {
    try {
      const filePath = path.join(__dirname, '..', '..', 'data', `${key}.json`);
      const raw = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(raw);
    } catch (_) {}
  }

  // 3. Final fallback: hardcoded defaults
  if (data === null) data = DEFAULTS[key];

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
    body: JSON.stringify(data)
  };
};
