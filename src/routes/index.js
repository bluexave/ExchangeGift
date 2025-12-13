const express = require('express');

/**
 * Register all API routes
 */
function registerRoutes(app) {
  const router = express.Router();

  // API routes
  router.use('/match', require('./api/matching'));
  router.use('/draft-pick-order', require('./api/pickOrder'));
  router.use('/health', require('./api/health'));
  router.use('/groups', require('./api/config'));

  app.use('/api', router);

  return app;
}

module.exports = {
  registerRoutes
};
