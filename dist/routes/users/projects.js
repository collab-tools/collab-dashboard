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

function getUserProjects(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;

  var retrieveProjects = function retrieveProjects(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    return user.getProjects();
  };

  var response = function response(projects) {
    res.status(200).json(projects);
  };

  return models.app.user.getUserById(userId).then(retrieveProjects).then(response).catch(next);
}

function getUserProject(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;

  var response = function response(project) {
    res.status(200).json({ success: true, projects: project });
  };

  return models.app.project.findProjectById(projectId).then(response).catch(next);
}

var projectsAPI = { getUserProjects: getUserProjects, getUserProject: getUserProject };

exports.default = projectsAPI;