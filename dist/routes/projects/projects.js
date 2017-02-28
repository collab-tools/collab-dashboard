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

var _constants = require('../../common/constants');

var _constants2 = _interopRequireDefault(_constants);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

function getProject(req, res, next) {
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(project) {
    if (_lodash2.default.isNil(project)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(_lodash2.default.head(project));
  };

  return models.app.project.getProjectWithMembers(projectId).then(response).catch(next);
}

function getProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(projects) {
    if (_lodash2.default.isNil(projects)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(projects);
  };

  return models.app.project.getProjectsWithMembers(startDate, endDate).then(response).catch(next);
}

function getUsers(req, res, next) {
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(users) {
    if (_lodash2.default.isNil(users)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.project.getUsersOfProject(projectId).then(response).catch(next);
}

var teamsAPI = { getProject: getProject, getProjects: getProjects, getUsers: getUsers };

exports.default = teamsAPI;