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

function getFiles(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(files) {
    if (_lodash2.default.isNil(files)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.log.file_log.getFiles(null, projectId, startDate, endDate).then(response).catch(next);
}

function getChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(changes) {
    if (_lodash2.default.isNil(changes)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.log.file_log.getProjectChanges(projectId, startDate, endDate).then(response).catch(next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_lodash2.default.isNil(activities)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.file_log.getProjectActivities(projectId, startDate, endDate).then(response).catch(next);
}

var driveAPI = {
  getFiles: getFiles,
  getChanges: getChanges,
  getActivities: getActivities
};

exports.default = driveAPI;