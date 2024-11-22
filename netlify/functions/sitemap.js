// functions/proxy-sitemap.js
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const response = await axios.get('https://realblog-api.onrender.com/sitemap.xml');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: response.data,
    };
  } catch (error) {
    console.error('Error fetching sitemap from backend:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
