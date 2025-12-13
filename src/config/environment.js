const path = require('path');

/**
 * Load and validate environment configuration
 */
function loadEnvironment() {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });

  const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    gmail: {
      email: process.env.GMAIL_EMAIL || 'santababy@gmail.com',
      password: process.env.GMAIL_PASSWORD || ''
    }
  };

  return config;
}

module.exports = {
  loadEnvironment
};
