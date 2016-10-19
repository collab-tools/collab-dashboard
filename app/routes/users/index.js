import config from 'config';
import jwt from 'express-jwt';
import github from './github';
import drive from './drive';
import cloud from './cloud';
import tasks from './tasks';
import milestones from './milestones';
import users from './users';
import projects from './projects';

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

  // Project Retrieval Related
  // ==========================================================
  usersRouter.get('/:userId/projects/', projects.getUserProjects);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/repos', github.getUserRepos);
  usersRouter.get('/:userId/github/commits', github.getUserCommits);
  usersRouter.get('/:userId/github/releases', github.getUserReleases);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/files', drive.getUserFiles);
  usersRouter.get('/:userId/drive/changes', drive.getUserChanges);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks', tasks.getTasksAssigned);
  usersRouter.get('/:userId/tasks/activities', tasks.getTasksAssigned);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones', milestones.getInvolvedMilestones);
  usersRouter.get('/:userId/milestones/activities', milestones.getActivities);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/cloud/overview', cloud.getOverview);

  return usersRouter;
};
