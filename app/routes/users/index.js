import github from './github';
import drive from './drive';
import ide from './ide';
import tasks from './tasks';
import milestones from './milestones';
import users from './users';
import projects from './projects';
import config from 'config';

module.exports = function (express) {
  const usersRouter = express.Router();
  // const auth = require('express-jwt')({
  //   secret: config.jwt_secret,
  //   userProperty: 'auth'
  // });
  // usersRouter.use(auth);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/overview', github.getOverview);
  usersRouter.get('/:userId/github/commits', github.getCommits);
  usersRouter.get('/:userId/github/commits/count', github.getCommitsCount);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/overview', drive.getOverview);
  usersRouter.get('/:userId/drive/revisions', drive.getRevisions);
  usersRouter.get('/:userId/drive/revisions/count', drive.getRevisionsCount);
  usersRouter.get('/:userId/drive/files', drive.getFiles);
  usersRouter.get('/:userId/drive/files/count', drive.getFilesCount);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/ide/overview', ide.getOverview);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks/overview', tasks.getOverview);
  usersRouter.get('/:userId/tasks/', tasks.getTasksAssigned);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones/overview', milestones.getOverview);

  // User Retrieval Related
  // =========================================================
  usersRouter.get('/:userId', users.getUser);
  usersRouter.get('/', users.getUsers);

  // Project Retrieval Related
  // ==========================================================
  usersRouter.get('/:userId/projects/:projectId', projects.getUserProject);
  usersRouter.get('/:userId/projects/', projects.getUserProjects);

  return usersRouter;
};
