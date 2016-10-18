import _ from 'lodash';
import boom from 'boom';
import jwt from 'jsonwebtoken';
import config from 'config';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const ERROR_INVALID = 'Invalid username / password';
const ERROR_ILLEGAL = 'Unauthorized access';
const JWT_EXPIRY_DAYS = 7;

function checkDevAccess(devKey) {
  return devKey === config.developer_key;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res, next) {
  const givenUser = req.body.username;
  const givenPass = req.body.password;
  const searchParameter = { username: givenUser };

  const authenticateUser = (user) => {
    if (_.isNil(user)) return next(boom.unauthorized(ERROR_INVALID));
    const isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(boom.unauthorized(ERROR_INVALID));

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + JWT_EXPIRY_DAYS);
    const payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    const token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token });
  };

  return models.log.admin.findOne(searchParameter)
    .then(authenticateUser)
    .catch(next);
}

function createAdmin(req, res, next) {
  const devKey = req.body.devKey;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;

  if (!checkDevAccess(devKey)) return next(boom.unauthorized(ERROR_ILLEGAL));

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(role)) {
    const payload = { username, password, name, role };
    const response = (success) => {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      res.status(200).json({ success });
    };
    return models.log.admin.addUser(payload).then(response).catch(next);
  }

  return next(boom.unauthorized(ERROR_ILLEGAL));
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
