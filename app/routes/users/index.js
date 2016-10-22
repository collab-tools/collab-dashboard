import config from 'config';
import jwt from 'express-jwt';
import github from './github';
import drive from './drive';
import cloud from './cloud';
import tasks from './tasks';
import milestones from './milestones';
import users from './users';

module.exports = (express) => {
  const usersRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  usersRouter.use(auth);

  // User Retrieval Related
  // =========================================================
  usersRouter.get('/:userId', users.getUser);
  usersRouter.get('/', users.getUsers);
  usersRouter.get('/:userId/projects/', users.getUserProjects);
  usersRouter.get('/:userId/project/', users.getUserProject);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/repos', github.getUserRepos);
  usersRouter.get('/:userId/github/commits', github.getUserCommits);
  usersRouter.get('/:userId/github/releases', github.getUserReleases);
  usersRouter.get('/:userId/project/:projectId/github/repo', github.getProjectRepo);
  usersRouter.get('/:userId/project/:projectId/github/commits', github.getProjectCommits);
  usersRouter.get('/:userId/project/:projectId/github/releases', github.getProjectReleases);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/files', drive.getUserFiles);
  usersRouter.get('/:userId/drive/changes', drive.getUserChanges);
  usersRouter.get('/:userId/drive/activities', drive.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/drive/files', drive.getProjectFiles);
  usersRouter.get('/:userId/project/:projectId/drive/changes', drive.getProjectChanges);
  usersRouter.get('/:userId/project/:projectId/drive/activities', drive.getProjectActivities);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks', tasks.getUserTasks);
  usersRouter.get('/:userId/tasks/activities', tasks.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/tasks', tasks.getProjectTasks);
  usersRouter.get('/:userId/project/:projectId/tasks/activities', tasks.getProjectActivities);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones', milestones.getUserMilestones);
  usersRouter.get('/:userId/milestones/assigned', milestones.getAssignedUserMilestones);
  usersRouter.get('/:userId/milestones/tasks', milestones.getTasksByMilestones);
  usersRouter.get('/:userId/project/:projectId/milestones/tasks', milestones.getTasksByProjectMilestones);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/cloud/overview', cloud.getOverview);

  return usersRouter;
};
