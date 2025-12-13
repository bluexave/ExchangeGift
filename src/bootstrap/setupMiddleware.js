const { configureServer } = require('../config/server');
const requestLogger = require('../middleware/requestLogger');

/**
 * Setup Express middleware
 */
function setupMiddleware(app) {
  // Server configuration (cors, json)
  configureServer(app);

  // Request logging
  app.use(requestLogger);

  return app;
}

module.exports = {
  setupMiddleware
};
