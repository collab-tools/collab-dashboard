'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var retrieveFilesAndRevisions = function retrieveFilesAndRevisions(user) {
    var googleId = user.google_id;
    var promiseArray = [models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange), models.log.revision_log.getUserRevisions(googleId, null, convertedRange)];
    return _bluebird2.default.all(promiseArray);
  };

  var response = function response(query) {
    var payload = {
      files: query[0],
      revisions: query[1]
    };
    res.status(200).json(payload);
  };

  return this.models.app.user.getUserById(userId).then(retrieveFilesAndRevisions).then(response).catch(next);
}

function getFiles(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var retrieveFiles = function retrieveFiles(user) {
    var googleId = user.google_id;
    return models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange);
  };

  var response = function response(files) {
    res.status(200).json(files);
  };

  return this.models.app.user.getUserById(userId).then(retrieveFiles).then(response).catch(next);
}

function getFilesCount(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var retrieveFiles = function retrieveFiles(user) {
    var googleId = user.google_id;
    return models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange);
  };

  var response = function response(files) {
    res.status(200).json({ count: files.length });
  };

  return this.models.app.user.getUserById(userId).then(retrieveFiles).then(response).catch(next);
}

function getRevisions(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var retrieveRevisions = function retrieveRevisions(user) {
    var googleId = user.google_id;
    return models.log.revision_log.getUserRevisionsByProject(googleId, projectId, null, convertedRange);
  };

  var response = function response(revisions) {
    res.status(200).json(revisions);
  };

  return this.models.app.user.getUserById(userId).then(retrieveRevisions).then(response).catch(next);
}

function getRevisionsCount(req, res, next) {
  req.checkParams('userId', 'userId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.checkQuery('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.query.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var retrieveRevisions = function retrieveRevisions(user) {
    var googleId = user.google_id;
    return models.log.revision_log.getUserRevisionsByProject(googleId, projectId, null, convertedRange);
  };

  var response = function response(revisions) {
    res.status(200).json({ count: revisions.length });
  };

  return this.models.app.user.getUserById(userId).then(retrieveRevisions).then(response).catch(next);
}

var driveAPI = {
  getOverview: getOverview,
  getRevisions: getRevisions,
  getRevisionsCount: getRevisionsCount,
  getFiles: getFiles,
  getFilesCount: getFilesCount
};

exports.default = driveAPI;