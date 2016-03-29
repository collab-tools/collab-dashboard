module.exports = function (app, express) {
  // Get all four sub-routers and configure the app to use it
  const adminRouter = require('./admin')(express);
  const globalRouter = require('./global')(express);
  const projectsRouter = require('./projects')(express);
  const usersRouter = require('./users')(express);

  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/users', usersRouter);
};
