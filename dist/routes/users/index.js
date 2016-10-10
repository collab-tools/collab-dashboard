'use strict';

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _github = require('./github');

var _github2 = _interopRequireDefault(_github);

var _drive = require('./drive');

var _drive2 = _interopRequireDefault(_drive);

var _cloud = require('./cloud');

var _cloud2 = _interopRequireDefault(_cloud);

var _tasks = require('./tasks');

var _tasks2 = _interopRequireDefault(_tasks);

var _milestones = require('./milestones');

var _milestones2 = _interopRequireDefault(_milestones);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (express) {
  var usersRouter = express.Router();
  var auth = (0, _expressJwt2.default)({
    secret: _config2.default.jwt_secret,
    userProperty: 'auth'
  });

  usersRouter.use(auth);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/overview', _github2.default.getOverview);
  usersRouter.get('/:userId/github/commits', _github2.default.getCommits);
  usersRouter.get('/:userId/github/commits/count', _github2.default.getCommitsCount);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/overview', _drive2.default.getOverview);
  usersRouter.get('/:userId/drive/revisions', _drive2.default.getRevisions);
  usersRouter.get('/:userId/drive/revisions/count', _drive2.default.getRevisionsCount);
  usersRouter.get('/:userId/drive/files', _drive2.default.getFiles);
  usersRouter.get('/:userId/drive/files/count', _drive2.default.getFilesCount);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/cloud/overview', _cloud2.default.getOverview);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks/overview', _tasks2.default.getOverview);
  usersRouter.get('/:userId/tasks/', _tasks2.default.getTasksAssigned);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones/overview', _milestones2.default.getOverview);

  // User Retrieval Related
  // =========================================================
  usersRouter.get('/:userId', _users2.default.getUser);
  usersRouter.get('/', _users2.default.getUsers);

  // Project Retrieval Related
  // ==========================================================
  usersRouter.get('/:userId/projects/:projectId', _projects2.default.getUserProject);
  usersRouter.get('/:userId/projects/', _projects2.default.getUserProjects);

  return usersRouter;
};