const jwt = require('jsonwebtoken');
const models = require('../../models');

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res) {
  const searchParameter = {
    username: req.body.username
  };

  const givenUser = req.body.username;
  const givenPass = req.body.password;

  const authenticateUser = function (user) {

  };

  const handleInvalidQuery = function (error) {

  };

  return models.log.admin.findOne(searchParameter)
      .then(authenticateUser)
      .catch(handleInvalidQuery);
}

module.exports = function (express) {
  let adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);

  return adminRouter;
};