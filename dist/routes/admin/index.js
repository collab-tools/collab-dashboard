'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_INVALID = 'Invalid username / password';
var ERROR_ILLEGAL = 'Unauthorized access';
var JWT_EXPIRY_DAYS = 7;

function checkDevAccess(devKey) {
  return devKey === _config2.default.developer_mode;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res, next) {
  var givenUser = req.body.username;
  var givenPass = req.body.password;
  var searchParameter = { username: givenUser };

  var authenticateUser = function authenticateUser(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.unauthorized(ERROR_INVALID));
    var isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(_boom2.default.unauthorized(ERROR_INVALID));

    var expiry = new Date();
    expiry.setDate(expiry.getDate() + JWT_EXPIRY_DAYS);
    var payload = {
      name: user.name,
      username: user.username,
      role: user.role,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };
    var token = _jsonwebtoken2.default.sign(payload, _config2.default.jwt_secret);
    res.status(200).json({ success: true, token: token });
  };

  return models.log.admin.findOne(searchParameter).then(authenticateUser).catch(next);
}

function createAdmin(req, res, next) {
  var devKey = req.body.devKey;
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var role = req.body.role;

  if (!checkDevAccess(devKey)) return next(_boom2.default.unauthorized(ERROR_ILLEGAL));

  // Validate that all mandatory fields are given
  if (_lodash2.default.isNil(username) && _lodash2.default.isNil(password) && _lodash2.default.isNil(name) && _lodash2.default.isNil(role)) {
    var payload = { username: username, password: password, name: name, role: role };
    var response = function response(success) {
      if (!success) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
      res.status(200).json({ success: success });
    };
    return models.log.admin.addUser(payload).then(response).catch(next);
  }

  return next(_boom2.default.unauthorized(ERROR_ILLEGAL));
}

module.exports = function (express) {
  var adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);

  // Developer Accessible Endpoints
  // =========================================================
  adminRouter.post('/', createAdmin);
  return adminRouter;
};