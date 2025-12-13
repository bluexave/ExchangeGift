const { registerRoutes } = require('../routes');
const errorHandler = require('../middleware/errorHandler');

/**
 * Setup API routes and error handling
 */
function setupRoutes(app) {
  registerRoutes(app);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = {
  setupRoutes
};
