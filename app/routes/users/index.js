import github from './github';
import drive from './drive';
import ide from './ide';
import tasks from './tasks';
import milestones from './milestones';
import users from './users';
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
  usersRouter.get('/github/overview', github.getOverview);


  // Google Drive Related
  // =========================================================
  usersRouter.get('/drive/overview', drive.getOverview);

  // Dev Mode Usage
  // =========================================================
  usersRouter.get('/drive/oauth', drive.oauth);
  usersRouter.get('/drive/oauth/callback', drive.oauthCallback);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/ide/overview', ide.getOverview);

  // Tasks Related
  // =========================================================
  usersRouter.get('/tasks/overview', tasks.getOverview);


  // Milestones Related
  // =========================================================
  usersRouter.get('/milestones/overview', milestones.getOverview);


  // User Retrieval Related
  // =========================================================
  usersRouter.get('/:userId', users.getUser);
  usersRouter.get('/', users.getUsers);


  return usersRouter;
};
