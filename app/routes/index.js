import adminFactory from './admin';
import analyticsFactory from './analytics';
import globalFactory from './global';
import projectsFactory from './projects';
import usersFactory from './users';

module.exports = function (app, express) {
  // Get all four sub-routers and configure the app to use it
  const adminRouter = adminFactory(express);
  const analyticsRouter = analyticsFactory(express);
  const globalRouter = globalFactory(express);
  const projectsRouter = projectsFactory(express);
  const usersRouter = usersFactory(express);

  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/users', usersRouter);
};
