'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _constants = require('../../common/constants');

var _constants2 = _interopRequireDefault(_constants);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

function checkDevAccess(devKey) {
  return devKey === _config2.default.developer_key;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res, next) {
  var givenUser = req.body.username;
  var givenPass = req.body.password;
  var searchParameter = { username: givenUser };

  var authenticateUser = function authenticateUser(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.unauthorized(_constants2.default.templates.error.unauthorized));
    var isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(_boom2.default.unauthorized(_constants2.default.templates.error.unauthorized));

    var expiry = new Date();
    expiry.setDate(expiry.getDate() + _constants2.default.defaults.jwtExpiry);
    var payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    var token = _jsonwebtoken2.default.sign(payload, _config2.default.jwt_secret);
    res.status(200).json({ success: true, token: token, settings: user.settings });
  };

  return models.log.admin.findOne(searchParameter).then(authenticateUser).catch(next);
}

function createAdmin(req, res, next) {
  var devKey = req.body.devKey;
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var role = req.body.role;
  var settings = req.body.settings || {};

  if (!checkDevAccess(devKey)) {
    return next(_boom2.default.unauthorized(_constants2.default.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_lodash2.default.isNil(username) && !_lodash2.default.isNil(password) && !_lodash2.default.isNil(name) && !_lodash2.default.isNil(role)) {
    var payload = { username: username, password: password, name: name, role: role, settings: JSON.stringify(settings) };
    var response = function response(success) {
      if (!success) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
      res.status(200).json({ success: success });
    };
    return models.log.admin.addUser(payload).then(response).catch(next);
  }

  return next(_boom2.default.unauthorized(_constants2.default.templates.error.unauthorized));
}

function updateAdmin(req, res, next) {
  var adminUpdate = req.body.admin;
  adminUpdate.username = req.auth.username;
  var response = function response(updates) {
    if (!updates) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var user = updates[1][0];
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + _constants2.default.defaults.jwtExpiry);
    var payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    var token = _jsonwebtoken2.default.sign(payload, _config2.default.jwt_secret);
    res.status(200).json({ success: true, token: token, settings: user.settings });
  };

  return models.log.admin.updateUser(adminUpdate).then(response).catch(next);
}

module.exports = function (express) {
  var auth = (0, _expressJwt2.default)({
    secret: _config2.default.jwt_secret,
    userProperty: 'auth'
  });

  var adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);

  // Developer Accessible Endpoints
  // =========================================================
  adminRouter.post('/', createAdmin);
  adminRouter.put('/', auth, updateAdmin);
  return adminRouter;
};