module.exports = function(express) {
	var adminRouter = express.Router()

	// Dashboard Adminstration Endpoints
	// =========================================================
	adminRouter.post('/authenticate', authenticate)

	return adminRouter
}

function authenticate(req, res) {

}