import github from './github'
import drive from './drive'
import ide from './ide'
import tasks from './tasks'
import milestones from './milestones'

module.exports = function(express) {
    const globalRouter = express.Router()

	// GitHub Related
	// =========================================================
    globalRouter.get('/github/overview', github.getOverview)


    // Google Drive Related
	// =========================================================
    globalRouter.get('/drive/overview', drive.getOverview)


	// Cloud IDE Related
	// =========================================================
	globalRouter.get('/ide/overview', ide.getOverview)


	// Tasks Related
	// =========================================================
    globalRouter.get('/tasks/overview', tasks.getOverview)


	// Milestones Related
	// =========================================================	
    globalRouter.get('/milestones/overview', milestones.getOverview)


    return globalRouter
}