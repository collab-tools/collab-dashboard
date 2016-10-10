'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getProject(req, res, next) {
  req.query.getUser = req.query.getUser || false;
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('getUser', 'range ' + ERROR_MISSING_TEMPLATE).isBoolean();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.body.projectId;
  var getUser = req.query.getUser;
  var response = function response(project) {
    if (_lodash2.default.isNil(project)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(project);
  };

  var retrievalFunc = 'findProjectById';
  if (getUser) retrievalFunc = 'getProjectWithMembers';

  return models.app.project[retrievalFunc](projectId).then(response).catch(next);
}

function getProjects(req, res, next) {
  req.query.range = req.query.range || 7;
  req.query.getUser = req.query.getUser || false;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  req.checkQuery('getUser', 'range ' + ERROR_MISSING_TEMPLATE).isBoolean();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var getUser = req.query.getUser;
  var response = function response(projects) {
    if (_lodash2.default.isNil(projects)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(projects);
  };

  var retrievalFunc = 'getProjects';
  if (getUser) retrievalFunc = 'getProjectsWithMembers';

  return models.app.project[retrievalFunc](convertedRange).then(response).catch(next);
}

function getProjectsCount(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var response = function response(projectsCount) {
    if (_lodash2.default.isNil(projectsCount)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(projectsCount);
  };
  return models.app.project.getProjectsCount(convertedRange).then(response).catch(next);
}

var teamsAPI = { getProject: getProject, getProjects: getProjects, getProjectsCount: getProjectsCount };

exports.default = teamsAPI;