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

  // GitHub Related
  // =========================================================
  projectsRouter.get('/:projectId/github/overview', _github2.default.getOverview);
  projectsRouter.get('/:projectId/github/commits', _github2.default.getCommits);

  // Google Drive Related
  // =========================================================
  projectsRouter.get('/:projectId/drive/overview', _drive2.default.getOverview);
  projectsRouter.get('/:projectId/drive/files', _drive2.default.getFiles);
  projectsRouter.get('/:projectId/drive/revisions', _drive2.default.getRevisions);

  // Cloud IDE Related
  // =========================================================
  projectsRouter.get('/:projectId/cloud/overview', _cloud2.default.getOverview);

  // Tasks Related
  // =========================================================
  projectsRouter.get('/:projectId/tasks/overview', _tasks2.default.getOverview);
  projectsRouter.get('/:projectId/tasks', _tasks2.default.getTasks);

  // Milestones Related
  // =========================================================
  projectsRouter.get('/:projectId/milestones/overview', _milestones2.default.getOverview);
  projectsRouter.get('/:projectId/milestones', _milestones2.default.getMilestones);

  // Projects Retrieval Related
  // =========================================================
  projectsRouter.get('/:projectId', _projects2.default.getProject);
  projectsRouter.get('/', _projects2.default.getProjects);

  return projectsRouter;
};