/**
 * Express server configuration
 */
function configureServer(app) {
  const cors = require('cors');
  
  // Middleware
  app.use(cors());
  app.use(require('express').json());
  
  return app;
}

module.exports = {
  configureServer
};
