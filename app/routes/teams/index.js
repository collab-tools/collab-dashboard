import github from './github';
import drive from './drive';
import ide from './ide';
import tasks from './tasks';
import milestones from './milestones';
import teams from './teams';
import config from 'config';

module.exports = function (express) {
  const teamsRouter = express.Router();
  const auth = require('express-jwt')({
    secret: config['jwt-secret'],
    userProperty: 'auth'
  });
  teamsRouter.use(auth);

  // GitHub Related
  // =========================================================
  teamsRouter.get('/github/overview', github.getOverview);


  // Google Drive Related
  // =========================================================
  teamsRouter.get('/drive/overview', drive.getOverview);


  // Cloud IDE Related
  // =========================================================
  teamsRouter.get('/ide/overview', ide.getOverview);


  // Tasks Related
  // =========================================================
  teamsRouter.get('/tasks/overview', tasks.getOverview);


  // Milestones Related
  // =========================================================
  teamsRouter.get('/milestones/overview', milestones.getOverview);


  // Team Retrieval Related
  // =========================================================
  teamsRouter.get('/:team', teams.getTeam);


  return teamsRouter;
};
