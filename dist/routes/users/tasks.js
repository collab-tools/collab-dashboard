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

function getOverview(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.query.projectId;
  var userId = req.params.userId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var processLogs = function processLogs(logs) {
    var payload = { tasks: {} };
    if (_lodash2.default.isNil(logs)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    payload.logs = logs;

    // Pseudo-map data structure to avoid duplicate pulls from database
    logs.forEach(function (log) {
      log = log.toJSON();
      payload.tasks[log.taskId] = true;
    });

    var relevantTasks = [];
    _lodash2.default.forOwn(payload.tasks, function (value, key) {
      relevantTasks.push(models.app.task.getTask(key));
    });

    // Retrieve all tasks referenced by log
    return Promise.all(relevantTasks).then(function (tasks) {
      tasks.forEach(function (task) {
        task = task.toJSON();
        payload.tasks[task.id] = task;
      });
      return payload;
    });
  };

  var response = function response(payload) {
    res.status(200).json(payload);
  };

  return models.log.task_log.getByProject(userId, projectId, convertedRange).then(processLogs).then(response).catch(next);
}

function getTasksAssigned(req, res, next) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', ERROR_BAD_REQUEST).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range || 7;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(tasks) {
    res.status(200).json(tasks);
  };

  return models.app.tasks.getTasksByAssignee(userId, projectId, convertedRange).then(response).catch(next);
}

var tasksAPI = { getOverview: getOverview, getTasksAssigned: getTasksAssigned };

exports.default = tasksAPI;