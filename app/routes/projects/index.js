import github from './github';
import drive from './drive';
import ide from './ide';
import tasks from './tasks';
import milestones from './milestones';
import projects from './projects';
import config from 'config';

module.exports = function (express) {
  const projectsRouter = express.Router();
  const auth = require('express-jwt')({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });
  projectsRouter.use(auth);

  // GitHub Related
  // =========================================================
  projectsRouter.get('/:projectId/github/overview', github.getOverview);
  projectsRouter.get('/:projectId/github/commits', github.getCommits);

  // Google Drive Related
  // =========================================================
  projectsRouter.get('/:projectId/drive/overview', drive.getOverview);
  projectsRouter.get('/:projectId/drive/files', drive.getFiles);
  projectsRouter.get('/:projectId/drive/revisions', drive.getRevisions);

  // Cloud IDE Related
  // =========================================================
  projectsRouter.get('/:projectId/ide/overview', ide.getOverview);

  // Tasks Related
  // =========================================================
  projectsRouter.get('/:projectId/tasks/overview', tasks.getOverview);
  projectsRouter.get('/:projectId/tasks', tasks.getTasks);

  // Milestones Related
  // =========================================================
  projectsRouter.get('/:projectId/milestones/overview', milestones.getOverview);
  projectsRouter.get('/:projectId/milestones', milestones.getMilestones);

  // Team Retrieval Related
  // =========================================================
  projectsRouter.get('/:projectId', projects.getProject);
  projectsRouter.get('/', projects.getProjects);

  return projectsRouter;
};
