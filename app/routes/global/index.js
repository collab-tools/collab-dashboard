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
  globalRouter.get('/github/repos', github.getRepositories);
  globalRouter.get('/github/commits', github.getCommits);
  globalRouter.get('/github/commits/:commitId', github.getCommit);
  globalRouter.get('/github/releases', github.getReleases);
  globalRouter.get('/github/releases/:releaseId', github.getRelease);
  globalRouter.get('/github/users', github.getParticipatingUsers);
  globalRouter.get('/github/projects', github.getParticipatingProjects);
  globalRouter.get('/github/assets', github.downloadAssets);

  // Google Drive Related
  // =========================================================
  globalRouter.get('/drive/files', drive.getFiles);
  globalRouter.get('/drive/files/changes', drive.getChanges);
  globalRouter.get('/drive/files/activities', drive.getActivities);
  globalRouter.get('/drive/files/:fileId', drive.getFile);
  globalRouter.get('/drive/files/:fileId/changes', drive.getFileChanges);
  globalRouter.get('/drive/files/:fileId/activities', drive.getFileActivities);
  globalRouter.get('/drive/users', drive.getParticipatingUsers);
  globalRouter.get('/drive/projects', drive.getParticipatingProjects);

  // Tasks Related
  // =========================================================
  globalRouter.get('/tasks', tasks.getTasks);
  globalRouter.get('/tasks/activities', tasks.getActivities);
  globalRouter.get('/tasks/users', tasks.getParticipatingUsers);
  globalRouter.get('/tasks/projects', tasks.getParticipatingProjects);
  globalRouter.get('/tasks/:taskId', tasks.getTask);
  globalRouter.get('/tasks/:taskId/activities', tasks.getTaskActivities);

  // Milestones Related
  // =========================================================
  globalRouter.get('/milestones', milestones.getMilestones);
  globalRouter.get('/milestones/activities', milestones.getActivities);
  globalRouter.get('/milestones/tasks', milestones.getTasksByMilestones);
  globalRouter.get('/milestones/users', milestones.getParticipatingUsers);
  globalRouter.get('/milestones/projects', milestones.getParticipatingProjects);
  globalRouter.get('/milestones/:milestoneId', milestones.getMilestone);
  globalRouter.get('/milestones/:milestoneId/activities', milestones.getMilestoneActivities);

  // Cloud IDE Related
  // =========================================================
  globalRouter.get('/cloud/overview', cloud.getOverview);

  return globalRouter;
};
