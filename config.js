const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ZEPTO_BASE_URL: process.env.ZEPTO_BASE_URL,
  BLINKIT_BASE_URL: process.env.BLINKIT_BASE_URL,
  SWIGGY_BASE_URL: process.env.SWIGGY_BASE_URL,
  APP_VERSION: process.env.APP_VERSION,
  CLIENT_ID: process.env.CLIENT_ID,
  PORT: process.env.PORT
}
