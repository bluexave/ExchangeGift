/**
 * Start the Express server
 */
function startServer(app, port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Gift Exchange API running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = {
  startServer
};
