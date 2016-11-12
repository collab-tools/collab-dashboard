import _ from 'lodash';
import boom from 'boom';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from 'config';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

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
    if (_.isNil(user)) return next(boom.unauthorized(constants.templates.error.unauthorized));
    const isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(boom.unauthorized(constants.templates.error.unauthorized));

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
    const payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    const token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token, settings: user.settings });
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
  const settings = req.body.settings || {};


  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(role)) {
    const payload = { username, password, name, role, settings: JSON.stringify(settings) };
    const response = (success) => {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      res.status(200).json({ success });
    };
    return models.log.admin.addUser(payload)
      .then(response)
      .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

function updateAdmin(req, res, next) {
  const adminUpdate = req.body.admin;
  adminUpdate.username = req.auth.username;
  const response = (updates) => {
    if (!updates) return next(boom.badRequest(constants.templates.error.badRequest));
    const user = updates[1][0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
    const payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    const token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token, settings: user.settings });
  };

  return models.log.admin.updateUser(adminUpdate)
    .then(response)
    .catch(next);
}

module.exports = function (express) {
  const auth = expressJwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  const adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);

  // Developer Accessible Endpoints
  // =========================================================
  adminRouter.post('/', createAdmin);
  adminRouter.put('/', auth, updateAdmin);
  return adminRouter;
};
