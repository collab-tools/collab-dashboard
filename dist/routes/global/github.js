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

function getRepositories(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(repos) {
    if (_lodash2.default.isNil(repos)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(repos);
  };

  return models.app.project.getRepositories(startDate, endDate).then(response).catch(next);
}

function getCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commits) {
    if (_lodash2.default.isNil(commits)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(startDate, endDate).then(response).catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', 'commitId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var commitId = req.params.commitId;
  var response = function response(commit) {
    if (_lodash2.default.isNil(commit)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId).then(response).catch(next);
}

function getReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_lodash2.default.isNil(releases)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(startDate, endDate).then(response).catch(next);
}

function getRelease(req, res, next) {
  req.checkParams('releaseId', 'releaseId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var releaseId = req.params.releaseId;
  var response = function response(release) {
    if (_lodash2.default.isNil(release)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId).then(response).catch(next);
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

  return models.log.commit_log.getParticipatingUsers(startDate, endDate).then(response).catch(next);
}

var githubAPI = {
  getRepositories: getRepositories,
  getCommits: getCommits,
  getCommit: getCommit,
  getReleases: getReleases,
  getRelease: getRelease,
  getParticipatingUsers: getParticipatingUsers
};

exports.default = githubAPI;