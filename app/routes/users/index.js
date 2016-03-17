import github from './github'
import drive from './drive'
import ide from './ide'
import tasks from './tasks'
import milestones from './milestones'
import users from './users'

module.exports = function(express) {
    const usersRouter = express.Router()

	// GitHub Related
	// =========================================================
    usersRouter.get('/github/overview', github.getOverview)


    // Google Drive Related
	// =========================================================
    usersRouter.get('/drive/overview', drive.getOverview)


	// Cloud IDE Related
	// =========================================================
	usersRouter.get('/ide/overview', ide.getOverview)


	// Tasks Related
	// =========================================================
    usersRouter.get('/tasks/overview', tasks.getOverview)


	// Milestones Related
	// =========================================================	
    usersRouter.get('/milestones/overview', milestones.getOverview)


    // User Retrieval Related
    // =========================================================
    usersRouter.get('/:user', users.getUser)


    return usersRouter
}