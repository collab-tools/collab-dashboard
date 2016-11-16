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

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _constants = require('../../common/constants');

var _constants2 = _interopRequireDefault(_constants);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

function getRepo(req, res, next) {
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(project) {
    if (_lodash2.default.isNil(project) || _lodash2.default.isNil(project.githubRepoName) || _lodash2.default.isNil(project.githubRepoOwner)) {
      return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    }

    var payload = {
      githubRepoName: project.githubRepoName,
      githubRepoOwner: project.githubRepoOwner
    };

    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId).then(response).catch(next);
}

function getCommits(req, res, next) {
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

  var response = function response(commits) {
    if (_lodash2.default.isNil(commits)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getProjectCommits(projectId, startDate, endDate).then(response).catch(next);
}

function getReleases(req, res, next) {
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

  var response = function response(releases) {
    if (_lodash2.default.isNil(releases)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getProjectReleases(projectId, startDate, endDate).then(response).catch(next);
}

function getContributors(req, res, next) {
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_lodash2.default.isNil(project) || _lodash2.default.isNil(project.githubRepoName) || _lodash2.default.isNil(project.githubRepoOwner)) {
      return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  var response = function response(contributors) {
    if (_lodash2.default.isNil(contributors)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    res.status(200).json(contributors);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(_github2.default.repos.getStatsContributors).then(response).catch(next);
}

function getStatistics(req, res, next) {
  req.checkParams('projectId', 'projectId ' + _constants2.default.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_lodash2.default.isNil(project) || _lodash2.default.isNil(project.githubRepoName) || _lodash2.default.isNil(project.githubRepoOwner)) {
      return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  var retrieveStats = function retrieveStats(repo) {
    return Promise.all([_github2.default.repos.getStatsCommitActivity(repo), _github2.default.repos.getStatsCodeFrequency(repo)]);
  };

  var response = function response(stats) {
    if (_lodash2.default.isNil(stats)) return next(_boom2.default.badRequest(_constants2.default.templates.error.badRequest));
    var payload = { commits: stats[0], codes: stats[1] };
    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(retrieveStats).then(response).catch(next);
}

var githubAPI = {
  getRepo: getRepo,
  getCommits: getCommits,
  getReleases: getReleases,
  getContributors: getContributors,
  getStatistics: getStatistics
};

exports.default = githubAPI;