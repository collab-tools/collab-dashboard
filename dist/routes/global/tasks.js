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
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest('test', errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var response = function response(data) {
    if (_lodash2.default.isNil(data)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json({ count: data.count, activities: data.rows });
  };

  return models.log.task_log.getByRange(convertedRange).then(response).catch(next);
}

function getTasks(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  if (_lodash2.default.isUndefined(req.query.count)) req.checkQuery('count', ERROR_BAD_REQUEST).isBoolean();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var evalQuery = function evalQuery() {
    if (req.query.count) return models.app.task.getCount(convertedRange);
    return models.app.tasks.getTasks(convertedRange);
  };
  var response = function response(data) {
    if (_lodash2.default.isNil(data)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    var payload = req.query.count ? { count: data } : { tasks: data };
    res.status(200).json(payload);
  };

  return evalQuery().then(response).catch(next);
}

function getTask(req, res, next) {
  req.checkParams('taskId', 'taskId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var taskId = req.params.taskId;
  var response = function response(task) {
    if (_lodash2.default.isNil(task)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(task);
  };

  return models.app.task.getTask(taskId).then(response).catch(next);
}

var tasksAPI = { getOverview: getOverview, getTasks: getTasks, getTask: getTask };

exports.default = tasksAPI;