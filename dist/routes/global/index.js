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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (express) {
  var globalRouter = express.Router();
  var auth = (0, _expressJwt2.default)({
    secret: _config2.default.jwt_secret,
    userProperty: 'auth'
  });

  globalRouter.use(auth);

  // GitHub Related
  // =========================================================
  globalRouter.get('/github/repos', _github2.default.getRepositories);
  globalRouter.get('/github/commits', _github2.default.getCommits);
  globalRouter.get('/github/commits/:commitId', _github2.default.getCommit);
  globalRouter.get('/github/releases', _github2.default.getReleases);
  globalRouter.get('/github/releases/:releaseId', _github2.default.getRelease);
  globalRouter.get('/github/users', _github2.default.getParticipatingUsers);
  globalRouter.get('/github/projects', _github2.default.getParticipatingProjects);
  globalRouter.get('/github/assets', _github2.default.downloadAssets);

  // Google Drive Related
  // =========================================================
  globalRouter.get('/drive/files', _drive2.default.getFiles);
  globalRouter.get('/drive/files/changes', _drive2.default.getChanges);
  globalRouter.get('/drive/files/activities', _drive2.default.getActivities);
  globalRouter.get('/drive/files/:fileId', _drive2.default.getFile);
  globalRouter.get('/drive/files/:fileId/changes', _drive2.default.getFileChanges);
  globalRouter.get('/drive/files/:fileId/activities', _drive2.default.getFileActivities);
  globalRouter.get('/drive/users', _drive2.default.getParticipatingUsers);
  globalRouter.get('/drive/projects', _drive2.default.getParticipatingProjects);

  // Tasks Related
  // =========================================================
  globalRouter.get('/tasks', _tasks2.default.getTasks);
  globalRouter.get('/tasks/activities', _tasks2.default.getActivities);
  globalRouter.get('/tasks/users', _tasks2.default.getParticipatingUsers);
  globalRouter.get('/tasks/projects', _tasks2.default.getParticipatingProjects);
  globalRouter.get('/tasks/:taskId', _tasks2.default.getTask);
  globalRouter.get('/tasks/:taskId/activities', _tasks2.default.getTaskActivities);

  // Milestones Related
  // =========================================================
  globalRouter.get('/milestones', _milestones2.default.getMilestones);
  globalRouter.get('/milestones/activities', _milestones2.default.getActivities);
  globalRouter.get('/milestones/tasks', _milestones2.default.getTasksByMilestones);
  globalRouter.get('/milestones/users', _milestones2.default.getParticipatingUsers);
  globalRouter.get('/milestones/projects', _milestones2.default.getParticipatingProjects);
  globalRouter.get('/milestones/:milestoneId', _milestones2.default.getMilestone);
  globalRouter.get('/milestones/:milestoneId/activities', _milestones2.default.getMilestoneActivities);

  // Cloud IDE Related
  // =========================================================
  globalRouter.get('/cloud/overview', _cloud2.default.getOverview);

  return globalRouter;
};