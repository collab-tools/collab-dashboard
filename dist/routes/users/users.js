'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getUser(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;

  var response = function response(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(user);
  };

  return models.app.user.getUserById(userId).then(response).catch(next);
}

function getUsers(req, res, next) {
  var response = function response(users) {
    if (_lodash2.default.isNil(users)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(users);
  };

  return models.app.user.getUsers().then(response).catch(next);
}

var usersAPI = { getUser: getUser, getUsers: getUsers };

exports.default = usersAPI;