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

function getUserRepos(req, res, next) {
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var userId = req.params.userId;

  var retrieveRepos = function retrieveRepos(projects) {
    if (_lodash2.default.isNil(projects)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return _lodash2.default.map(projects, function (project) {
      return _lodash2.default.pick(project, ['githubRepoName', 'githubRepoOwner']);
    });
  };

  var response = function response(repos) {
    if (_lodash2.default.isNil(repos)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(repos);
  };

  return models.app.user.getUserProjects(userId).then(retrieveRepos).then(response).catch(next);
}

function getUserCommits(req, res, next) {
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

  var retrieveCommits = function retrieveCommits(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return models.log.commit_log.getUserCommits(user.githubLogin, null, startDate, endDate);
  };

  var response = function response(commmits) {
    if (_lodash2.default.isNil(commmits)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(commmits);
  };

  return models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

function getUserReleases(req, res, next) {
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

  var retrieveReleases = function retrieveReleases(projects) {
    if (_lodash2.default.isNil(projects)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var retrieval = [];
    _lodash2.default.forEach(projects, function (project) {
      retrieval.push(models.log.release_log.getProjectReleases(project.id, startDate, endDate));
    });
    return Promise.all(retrieval);
  };

  var response = function response(releases) {
    if (_lodash2.default.isNil(releases)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.app.user.getUserProjects(userId).then(retrieveReleases).then(response).catch(next);
}

function getProjectRepo(req, res, next) {
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_lodash2.default.isNil(project)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return _lodash2.default.pick(project, ['githubRepoName', 'githubRepoOwner']);
  };

  var response = function response(repo) {
    if (_lodash2.default.isNil(repo)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(repo);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(response).catch(next);
}

function getProjectCommits(req, res, next) {
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

  var retrieveCommits = function retrieveCommits(user) {
    if (_lodash2.default.isNil(user)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    return models.log.commit_log.getUserCommits(user.githubLogin, projectId, startDate, endDate);
  };

  var response = function response(commits) {
    if (_lodash2.default.isNil(commits)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

function getProjectReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || _constants2.default.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || _constants2.default.defaults.endDate;
  req.checkParams('userId', 'userId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + _constants2.default.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = (0, _moment2.default)(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = (0, _moment2.default)(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_lodash2.default.isNil(releases)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getProjectReleases(projectId, startDate, endDate).then(response).catch(next);
}

var githubAPI = {
  getUserRepos: getUserRepos,
  getUserCommits: getUserCommits,
  getUserReleases: getUserReleases,
  getProjectRepo: getProjectRepo,
  getProjectCommits: getProjectCommits,
  getProjectReleases: getProjectReleases
};

exports.default = githubAPI;