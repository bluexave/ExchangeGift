const express = require('express');
const { loadEnvironment } = require('./config/environment');
const { initializeEmail } = require('./config/email');
const { setupMiddleware } = require('./bootstrap/setupMiddleware');
const { setupRoutes } = require('./bootstrap/setupRoutes');
const { startServer } = require('./bootstrap/startServer');

/**
 * Application Factory
 * Composes all layers and bootstraps the Express app
 */
async function createApp() {
  // Load configuration
  const config = loadEnvironment();

  // Create Express app
  const app = express();

  // Setup middleware layer
  setupMiddleware(app);

  // Initialize email service
  initializeEmail(config.gmail);

  // Setup routes and error handling
  setupRoutes(app);

  return { app, config };
}

/**
 * Bootstrap and start server
 */
async function main() {
  try {
    const { app, config } = await createApp();
    await startServer(app, config.port);
  } catch (error) {
    console.error('[Fatal Error]', error);
    process.exit(1);
  }
}

// Start the application
main();

module.exports = createApp;
