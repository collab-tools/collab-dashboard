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

function getUserTasks(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(response).catch(next);
}

function getUserActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_lodash2.default.isNil(activities)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getUserActivities(userId, startDate, endDate).then(response).catch(next);
}

function getProjectTasks(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, startDate, endDate).then(response).catch(next);
}

function getProjectActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_lodash2.default.isNil(activities)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getUserActivitiesByProject(userId, projectId, startDate, endDate).then(response).catch(next);
}

var tasksAPI = {
  getUserTasks: getUserTasks,
  getUserActivities: getUserActivities,
  getProjectTasks: getProjectTasks,
  getProjectActivities: getProjectActivities
};

exports.default = tasksAPI;