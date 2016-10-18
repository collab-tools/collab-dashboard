import config from 'config';
import jwt from 'express-jwt';
import github from './github';
import drive from './drive';
import cloud from './cloud';
import tasks from './tasks';
import milestones from './milestones';

module.exports = function (express) {
  const globalRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  globalRouter.use(auth);

  // GitHub Related
  // =========================================================
  globalRouter.get('/github/repos/', github.getRepos);
  globalRouter.get('/github/commits/:commitId', github.getCommit);
  globalRouter.get('/github/commits', github.getCommits);
  globalRouter.get('/github/releases', github.getReleases);
  globalRouter.get('/github/releases/:releaseId', github.getRelease);
  globalRouter.get('/github/users', github.getParticipatingUsers);

  // Google Drive Related
  // =========================================================
  globalRouter.get('/drive/files', drive.getFiles);
  globalRouter.get('/drive/files/revisions', drive.getRevisions);
  globalRouter.get('/drive/files/:fileId', drive.getFile);
  globalRouter.get('/drive/files/:fileId/revisions', drive.getFileRevisions);
  globalRouter.get('/drive/users', drive.getParticipatingUsers);

  // Tasks Related
  // =========================================================
  globalRouter.get('/tasks/overview', tasks.getOverview);
  globalRouter.get('/tasks', tasks.getTasks);
  globalRouter.get('/tasks/:taskId', tasks.getTask);
  globalRouter.get('/tasks/users', tasks.getParticipatingUsers);

  // Milestones Related
  // =========================================================
  globalRouter.get('/milestones/overview', milestones.getOverview);
  globalRouter.get('/milestones', milestones.getMilestones);
  globalRouter.get('/milestones/:milestoneId', milestones.getMilestone);
  globalRouter.get('/milestones/users', milestones.getParticipatingUsers);

  // Cloud IDE Related
  // =========================================================
  globalRouter.get('/cloud/overview', cloud.getOverview);

  return globalRouter;
};
