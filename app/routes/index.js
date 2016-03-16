const config = require('../../config')
const admin = require('./admin')
const retrieval = require('./retrieval')

module.exports = function(app, express) {
	var apiRouter = express.Router()
	
	// Dashboard Adminstration Endpoints
	// =========================================================
	apiRouter.post('/authenticate', admin.authenticate(req, res))

	// Logging Retrieval Endpoints
	// =========================================================
	// GitHub Related
	// =========================================================
	// User Level
	// =========================================================

	// =========================================================
	// Team Level
	// =========================================================	
	apiRouter.get('/teams/:team/github/commits', retrieval.getTeam(req, res))

	// Google Drive Related
	// =========================================================

	// Cloud IDE Related
	// =========================================================
	// User Level 
	// =========================================================
	// =========================================================
	// Team Level
	// =========================================================	
	
	
	// Global Level
	// =========================================================
	apiRouter.get('/global/github/overview', retrieval.getGlobal)
	apiRouter.get('/global/drive/overview', retrieval)
	apiRouter.get('/global/ide/overview')
	apiRouter.get('/global/tasks/overview')
	apiRouter.get('/global/milestones/overview')


	return apiRouter
}