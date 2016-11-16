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

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _constants = require('../../common/constants');

var _constants2 = _interopRequireDefault(_constants);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

function getAssignedUserMilestones(req, res, next) {
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

  var retrieveMilestonesInvolved = function retrieveMilestonesInvolved(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var retrieval = [];
    _lodash2.default.flow(_lodash2.default.uniqBy('milestoneId'), _lodash2.default.pick('milestoneId'), _lodash2.default.compact, _lodash2.default.forEach(function (id) {
      retrieval.push(models.app.milestone.getMilestone(id));
    }))(tasks);
    return _bluebird2.default.all(retrieval);
  };

  var response = function response(milestones) {
    if (_lodash2.default.isNil(milestones)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(retrieveMilestonesInvolved).then(response).catch(next);
}

function getUserMilestones(req, res, next) {
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

  var retrieveMilestones = function retrieveMilestones(projects) {
    if (_lodash2.default.isNil(projects)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var retrieval = [];
    _lodash2.default.forEach(projects, function (project) {
      retrieval.push(models.app.milestone.getMilestonesByProject(project.id, startDate, endDate));
    });
    return _bluebird2.default.all(retrieval);
  };

  var response = function response(milestones) {
    if (_lodash2.default.isNil(milestones)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var groupedMilestones = _lodash2.default.flow(_lodash2.default.flatten, _lodash2.default.groupBy('milestoneId'))(milestones);
    res.status(200).json(groupedMilestones);
  };

  return models.app.user.getUserProjects(userId).then(retrieveMilestones).then(response).catch(next);
}

function getTasksByMilestones(req, res, next) {
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

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return _lodash2.default.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_lodash2.default.isNil(groupedTasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

function getTasksByProjectMilestones(req, res, next) {
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

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_lodash2.default.isNil(tasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return _lodash2.default.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_lodash2.default.isNil(groupedTasks)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

var milestonesAPI = {
  getAssignedUserMilestones: getAssignedUserMilestones,
  getUserMilestones: getUserMilestones,
  getTasksByMilestones: getTasksByMilestones,
  getTasksByProjectMilestones: getTasksByProjectMilestones
};

exports.default = milestonesAPI;