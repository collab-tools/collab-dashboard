const config = require('config');

module.exports = function (app, express) {
  // Get all three subrouters 
  const adminRouter = require('./admin')(express);
  const globalRouter = require('./global')(express);
  const teamsRouter = require('./teams')(express);
  const usersRouter = require('./users')(express);

  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/teams', teamsRouter);
  app.use('/api/users', usersRouter);
};