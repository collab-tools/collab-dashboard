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
  globalRouter.get('/github/overview', _github2.default.getOverview);
  globalRouter.get('/github/commits/:commitId', _github2.default.getCommit);
  globalRouter.get('/github/commits', _github2.default.getCommits);
  globalRouter.get('/github/releases', _github2.default.getReleases);
  globalRouter.get('/github/releases/:releaseId', _github2.default.getRelease);

  // Google Drive Related
  // =========================================================
  globalRouter.get('/drive/overview', _drive2.default.getOverview);
  globalRouter.get('/drive/files/revisions', _drive2.default.getRevisions);
  globalRouter.get('/drive/files/:fileId', _drive2.default.getFile);
  globalRouter.get('/drive/files/:fileId/revisions', _drive2.default.getFileRevisions);

  // Cloud IDE Related
  // =========================================================
  globalRouter.get('/cloud/overview', _cloud2.default.getOverview);

  // Tasks Related
  // =========================================================
  globalRouter.get('/tasks/overview', _tasks2.default.getOverview);
  globalRouter.get('/tasks', _tasks2.default.getTasks);
  globalRouter.get('/tasks/:taskId', _tasks2.default.getTask);

  // Milestones Related
  // =========================================================
  globalRouter.get('/milestones/overview', _milestones2.default.getOverview);
  globalRouter.get('/milestones', _milestones2.default.getMilestones);
  globalRouter.get('/milestones/:milestoneId', _milestones2.default.getMilestone);

  return globalRouter;
};