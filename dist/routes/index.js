'use strict';

var _admin = require('./admin');

var _admin2 = _interopRequireDefault(_admin);

var _analytics = require('./analytics');

var _analytics2 = _interopRequireDefault(_analytics);

var _global = require('./global');

var _global2 = _interopRequireDefault(_global);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app, express) {
  // Get all four sub-routers and configure the app to use it
  var adminRouter = (0, _admin2.default)(express);
  var analyticsRouter = (0, _analytics2.default)(express);
  var globalRouter = (0, _global2.default)(express);
  var projectsRouter = (0, _projects2.default)(express);
  var usersRouter = (0, _users2.default)(express);

  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/users', usersRouter);
};