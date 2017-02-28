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

function getMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  if (req.query.elapsed) {
    req.checkQuery('elapsed', 'elapsed ' + _constants2.default.templates.error.invalidData).isBoolean();
  }
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });

  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var elapsed = JSON.parse(req.query.elapsed);
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');
  var evalQuery = function evalQuery() {
    if (elapsed) return models.app.milestone.getElapsedMilestones(startDate, endDate);
    return models.app.milestone.getMilestones(startDate, endDate);
  };
  var response = function response(milestones) {
    if (_lodash2.default.isNil(milestones)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return evalQuery().then(response).catch(next);
}

function getMilestone(req, res, next) {
  req.checkParams('milestoneId', 'milestoneId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var milestoneId = req.params.milestoneId;
  var response = function response(milestone) {
    if (_lodash2.default.isNil(milestone)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(milestone);
  };

  return models.app.milestone.getMilestone(milestoneId).then(response).catch(next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_lodash2.default.isNil(activities)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getActivities(startDate, endDate).then(response).catch(next);
}

function getMilestoneActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('milestoneId', 'milestoneId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(_boom2.default.badRequest(errors));

  var milestoneId = req.params.milestoneId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_lodash2.default.isNil(activities)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getMilestoneActivities(milestoneId, startDate, endDate).then(response).catch(next);
}

function getTasksByMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return _lodash2.default.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_lodash2.default.isNil(groupedTasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasks(startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

function getParticipatingUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_lodash2.default.isNil(users)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.milestone_log.getParticipatingUsers(startDate, endDate).then(response).catch(next);
}

function getParticipatingProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_lodash2.default.isNil(users)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.milestone_log.getParticipatingProjects(startDate, endDate).then(response).catch(next);
}

var milestonesAPI = {
  getMilestones: getMilestones,
  getMilestone: getMilestone,
  getActivities: getActivities,
  getMilestoneActivities: getMilestoneActivities,
  getTasksByMilestones: getTasksByMilestones,
  getParticipatingUsers: getParticipatingUsers,
  getParticipatingProjects: getParticipatingProjects
};

exports.default = milestonesAPI;