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
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var processLogs = function processLogs(logs) {
    var payload = { milestones: {} };
    if (_lodash2.default.isNil(logs)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    payload.logs = logs;

    // Pseudo-map data structure to avoid duplicate pulls from database
    logs.forEach(function (log) {
      log = log.toJSON();
      payload.milestones[log.milestoneId] = true;
    });

    var relevantMilestones = [];
    _lodash2.default.forOwn(payload.milestones, function (value, key) {
      relevantMilestones.push(models.app.milestone.getMilestone(key));
    });

    // Retrieve all milestones referenced by log
    return Promise.all(relevantMilestones).then(function (milestones) {
      milestones.forEach(function (milestone) {
        milestone = milestone.toJSON();
        payload.milestones[milestone.id] = milestone;
      });
      return payload;
    });
  };

  var response = function response(payload) {
    res.status(200).json(payload);
  };

  return models.log.milestone_log.getByProject(projectId, convertedRange).then(processLogs).then(response).catch(next);
}

function getMilestones(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var response = function response(milestones) {
    if (_lodash2.default.isNil(milestones)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(milestones);
  };

  return models.app.milestone.getMilestonesByProject(projectId, convertedRange).then(response).catch(next);
}

var milestonesAPI = { getOverview: getOverview, getMilestones: getMilestones };

exports.default = milestonesAPI;