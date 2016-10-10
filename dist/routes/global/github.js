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
    var _ref2 = _slicedToArray(_ref, 4);

    var reposCount = _ref2[0];
    var commits = _ref2[1];
    var releases = _ref2[2];
    var usersCount = _ref2[3];

    var payload = {};
    payload.reposCount = reposCount;
    payload.commits = commits;
    payload.releases = releases;
    payload.usersCount = usersCount;
    return payload;
  };

  var response = function response(payload) {
    if (_lodash2.default.isNil(payload)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(payload);
  };

  var retrievalFunctions = [models.app.project.getRepositoriesCount(convertedRange), models.log.commit_log.getCommits(convertedRange), models.log.release_log.getReleases(convertedRange), models.app.user.getUsersCount(convertedRange)];

  return Promise.all(retrievalFunctions).then(processPayload).then(response).catch(next);
}

function getCommits(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commits) {
    if (_lodash2.default.isNil(commits)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(convertedRange).then(response).catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', 'commitId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var commitId = req.params.commitId;
  var response = function response(commit) {
    if (_lodash2.default.isNil(commit)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId).then(response).catch(next);
}

function getReleases(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_lodash2.default.isNil(releases)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(convertedRange).then(response).catch(next);
}

function getRelease(req, res, next) {
  req.checkParams('releaseId', 'releaseId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var releaseId = req.params.releaseId;
  var response = function response(release) {
    if (_lodash2.default.isNil(release)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId).then(response).catch(next);
}

var githubAPI = { getOverview: getOverview, getCommits: getCommits, getCommit: getCommit, getReleases: getReleases, getRelease: getRelease };

exports.default = githubAPI;