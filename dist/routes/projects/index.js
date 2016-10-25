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

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (express) {
  var projectsRouter = express.Router();
  var auth = (0, _expressJwt2.default)({
    secret: _config2.default.jwt_secret,
    userProperty: 'auth'
  });

  projectsRouter.use(auth);

  // Projects Retrieval Related
  // =========================================================
  projectsRouter.get('/', _projects2.default.getProjects);
  projectsRouter.get('/:projectId', _projects2.default.getProject);
  projectsRouter.get('/:projectId/users', _projects2.default.getUsers);

  // GitHub Related
  // =========================================================
  projectsRouter.get('/:projectId/github/repo', _github2.default.getRepo);
  projectsRouter.get('/:projectId/github/commits', _github2.default.getCommits);
  projectsRouter.get('/:projectId/github/releases', _github2.default.getReleases);
  projectsRouter.get('/:projectId/github/contributors', _github2.default.getContributors);
  projectsRouter.get('/:projectId/github/stats', _github2.default.getStatistics);

  // Google Drive Related
  // =========================================================
  projectsRouter.get('/:projectId/drive/files', _drive2.default.getFiles);
  projectsRouter.get('/:projectId/drive/changes', _drive2.default.getChanges);
  projectsRouter.get('/:projectId/drive/activities', _drive2.default.getActivities);

  // Tasks Related
  // =========================================================
  projectsRouter.get('/:projectId/tasks', _tasks2.default.getTasks);
  projectsRouter.get('/:projectId/tasks/activities', _tasks2.default.getActivities);

  // Milestones Related
  // =========================================================
  projectsRouter.get('/:projectId/milestones', _milestones2.default.getMilestones);
  projectsRouter.get('/:projectId/milestones/activities', _milestones2.default.getActivities);
  projectsRouter.get('/:projectId/milestones/tasks', _milestones2.default.getTasksByMilestones);

  // Cloud IDE Related
  // =========================================================
  projectsRouter.get('/:projectId/cloud/overview', _cloud2.default.getOverview);

  return projectsRouter;
};