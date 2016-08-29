const jwt = require('jsonwebtoken');
const models = require('../../models');
const config = require('config');

const ERROR_INVALID = 'Invalid username / password';
const ERROR_ILLEGAL = 'Unauthorized access';

function checkDevAccess(devKey) {
  return devKey === config.developer_mode;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res) {
  const givenUser = req.body.username;
  const givenPass = req.body.password;
  const searchParameter = { username: givenUser };

  const authenticateUser = user => {
    if (!user) res.boom.unauthorized(ERROR_INVALID);
    else {
      const isValidated = user.comparePassword(givenPass);
      if (!isValidated) res.boom.unauthorized(ERROR_INVALID);
      else {
        const payload = { name: user.name, username: user.username, role: user.role };
        const token = jwt.sign(payload, config.jwt_secret);
        res.json({ success: true, token });
      }
    }
  };

  const handleInvalidQuery = error => {
    console.log(error);
    res.boom.unauthorized(ERROR_INVALID);
  };

  return models.log.admin.findOne(searchParameter)
      .then(authenticateUser)
      .catch(handleInvalidQuery);
}

function createAdmin(req, res) {
  const devKey = req.body.devKey;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;

  if (!checkDevAccess(devKey)) return res.boom.unauthorized(ERROR_ILLEGAL);

  // Validate that all mandatory fields are given
  if (username && password && name && role) {
    const payload = { username, password, name, role };
    if (models.log.admin.addUser(payload)) return res.json({ success: true });
    return res.boom.badRequest('Invalid arguments given. Check your arguments.');
  }
  return res.boom.unauthorized(ERROR_ILLEGAL);
}

module.exports = function (express) {
  const adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);

  // Developer Accessible Endpoints
  // =========================================================
  adminRouter.post('/', createAdmin);
  return adminRouter;
};
