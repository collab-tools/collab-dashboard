import config from 'config';
import jwt from 'express-jwt';
import github from './github';
import drive from './drive';
import cloud from './cloud';
import tasks from './tasks';
import milestones from './milestones';
import projects from './projects';

module.exports = function (express) {
  const projectsRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  projectsRouter.use(auth);

  // Projects Retrieval Related
  // =========================================================
  projectsRouter.get('/:projectId', projects.getProject);
  projectsRouter.get('/', projects.getProjects);

  // User Retrieval Related
  // =========================================================
  projectsRouter.get('/:projectId/users', projects.getUsers);

  // GitHub Related
  // =========================================================
  projectsRouter.get('/:projectId/github/repo', github.getRepo);
  projectsRouter.get('/:projectId/github/commits', github.getCommits);
  projectsRouter.get('/:projectId/github/releases', github.getReleases);
  projectsRouter.get('/:projectId/github/contributors', github.getContributors);
  projectsRouter.get('/:projectId/github/activities', github.getActivities);

  // Google Drive Related
  // =========================================================
  projectsRouter.get('/:projectId/drive/files', drive.getFiles);
  projectsRouter.get('/:projectId/drive/changes', drive.getChanges);

  // Tasks Related
  // =========================================================
  projectsRouter.get('/:projectId/tasks', tasks.getTasks);
  projectsRouter.get('/:projectId/tasks/activities', tasks.getActivities);

  // Milestones Related
  // =========================================================
  projectsRouter.get('/:projectId/milestones', milestones.getMilestones);
  projectsRouter.get('/:projectId/milestones/activities', milestones.getActivities);

  // Cloud IDE Related
  // =========================================================
  projectsRouter.get('/:projectId/cloud/overview', cloud.getOverview);

  return projectsRouter;
};
