import github from './github';
import drive from './drive';
import cloud from './cloud';
import tasks from './tasks';
import milestones from './milestones';
import config from 'config';

module.exports = function (express) {
  const globalRouter = express.Router();
  const auth = require('express-jwt')({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });
  globalRouter.use(auth);

  // GitHub Related
  // =========================================================
  globalRouter.get('/github/overview', github.getOverview);
  globalRouter.get('/github/commits/:commitId', github.getCommit);
  globalRouter.get('/github/releases', github.getReleases);
  globalRouter.get('/github/releases/:releaseId', github.getRelease);

  // Google Drive Related
  // =========================================================
  globalRouter.get('/drive/overview', drive.getOverview);
  globalRouter.get('/drive/files/revisions', drive.getRevisions);
  globalRouter.get('/drive/files/:fileId', drive.getFile);
  globalRouter.get('/drive/files/:fileId/revisions', drive.getFileRevisions);

  // Cloud IDE Related
  // =========================================================
  globalRouter.get('/cloud/overview', cloud.getOverview);

  // Tasks Related
  // =========================================================
  globalRouter.get('/tasks/overview', tasks.getOverview);
  globalRouter.get('/tasks/:taskId', tasks.getTask);

  // Milestones Related
  // =========================================================
  globalRouter.get('/milestones/overview', milestones.getOverview);
  globalRouter.get('/milestones/:milestoneId', milestones.getMilestone);

  return globalRouter;
};
