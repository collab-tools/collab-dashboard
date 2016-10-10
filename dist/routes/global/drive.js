'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var processPayload = function processPayload(_ref) {
    var _ref2 = _slicedToArray(_ref, 5);

    var activeUsersCount = _ref2[0];
    var revisions = _ref2[1];
    var files = _ref2[2];
    var usersCount = _ref2[3];
    var projectsCount = _ref2[4];

    var payload = {};
    payload.activeUsersCount = activeUsersCount;
    payload.revisions = revisions;
    payload.files = files;
    payload.usersCount = usersCount;
    payload.projectsCount = projectsCount;
    return payload;
  };

  var response = function response(payload) {
    if (_lodash2.default.isNil(payload)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(payload);
  };

  var retrievalFunctions = [models.log.revision_log.getParticipationCount(convertedRange), models.log.revision_log.getRevisions(convertedRange), models.log.drive_log.getUniqueFiles(null, null, convertedRange), models.app.user.getUsersCount(convertedRange), models.app.project.getProjectsCount(convertedRange)];

  return Promise.all(retrievalFunctions).then(processPayload).then(response).catch(next);
}

function getRevisions(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commit) {
    if (_lodash2.default.isNil(commit)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commit);
  };

  return models.log.revision_log.getRevisions(convertedRange).then(response).catch(next);
}

function getFileRevisions(req, res, next) {
  req.checkParams('fileId', 'fileId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var fileId = req.params.fileId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var response = function response(revisions) {
    if (_lodash2.default.isNil(revisions)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(revisions);
  };

  return models.log.revision_log.getFileRevisions(fileId, convertedRange).then(response).catch(next);
}

function getFile(req, res, next) {
  req.checkParams('fileId', 'fileId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var fileId = req.params.fileId;
  var response = function response(file) {
    if (_lodash2.default.isNil(file)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(file);
  };

  return models.log.drive_log.getFile(fileId).then(response).catch(next);
}

var driveAPI = { getOverview: getOverview, getRevisions: getRevisions, getFileRevisions: getFileRevisions, getFile: getFile };

exports.default = driveAPI;