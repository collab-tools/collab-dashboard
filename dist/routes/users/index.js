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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (express) {
  var usersRouter = express.Router();
  var auth = (0, _expressJwt2.default)({
    secret: _config2.default.jwt_secret,
    userProperty: 'auth'
  });

  usersRouter.use(auth);

  // User Retrieval Related
  // =========================================================
  usersRouter.get('/', _users2.default.getUsers);
  usersRouter.get('/:userId', _users2.default.getUser);
  usersRouter.get('/:userId/projects', _users2.default.getUserProjects);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/repos', _github2.default.getUserRepos);
  usersRouter.get('/:userId/github/commits', _github2.default.getUserCommits);
  usersRouter.get('/:userId/github/releases', _github2.default.getUserReleases);
  usersRouter.get('/:userId/project/:projectId/github/repo', _github2.default.getProjectRepo);
  usersRouter.get('/:userId/project/:projectId/github/commits', _github2.default.getProjectCommits);
  usersRouter.get('/:userId/project/:projectId/github/releases', _github2.default.getProjectReleases);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/files', _drive2.default.getUserFiles);
  usersRouter.get('/:userId/drive/changes', _drive2.default.getUserChanges);
  usersRouter.get('/:userId/drive/activities', _drive2.default.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/drive/files', _drive2.default.getProjectFiles);
  usersRouter.get('/:userId/project/:projectId/drive/changes', _drive2.default.getProjectChanges);
  usersRouter.get('/:userId/project/:projectId/drive/activities', _drive2.default.getProjectActivities);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks', _tasks2.default.getUserTasks);
  usersRouter.get('/:userId/tasks/activities', _tasks2.default.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/tasks', _tasks2.default.getProjectTasks);
  usersRouter.get('/:userId/project/:projectId/tasks/activities', _tasks2.default.getProjectActivities);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones', _milestones2.default.getUserMilestones);
  usersRouter.get('/:userId/milestones/assigned', _milestones2.default.getAssignedUserMilestones);
  usersRouter.get('/:userId/milestones/tasks', _milestones2.default.getTasksByMilestones);
  usersRouter.get('/:userId/project/:projectId/milestones/tasks', _milestones2.default.getTasksByProjectMilestones);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/cloud/overview', _cloud2.default.getOverview);

  return usersRouter;
};