'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _octokat = require('octokat');

var _octokat2 = _interopRequireDefault(_octokat);

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

  // Access GitHub with user's token and retrieve relevant statistics
  // Dev Token for testing purposes
  var token = _config2.default.github_dev;
  var mockOwner = 'collab-tools';
  var mockProject = 'collab-dashboard';
  var mockRange = 'month';

  // Setup GitHub wrapper to retrieve information from GitHub
  var octoConfig = { token: token };
  var octo = (0, _octokat2.default)(octoConfig);
  var repo = octo.repos(mockOwner, mockProject);
  var overviewPayload = { success: true };
  var since = null; // Default - Everything
  if (mockRange === 'month') since = (0, _moment2.default)().startOf('month').format('X');else if (mockRange === 'week') since = (0, _moment2.default)().startOf('week').format('X');
  var githubName = void 0;

  var processUser = function processUser(user) {
    githubName = user.login;

    // Get all commits of the user and process
    return repo.commits.fetch({ since: since, author: githubName }).then(function (commits) {
      overviewPayload.commits = commits;
    });
  };

  var getRepoStats = function getRepoStats(contributors) {
    var contribStats = {};
    var defaultAcc = { a: 0, d: 0, c: 0 };

    contributors.forEach(function (contributor) {
      var rangeWeeks = since ? _lodash2.default.filter(contributor.weeks, function (week) {
        return week.w >= since;
      }) : contributor.weeks;
      contribStats[contributor.author.login] = rangeWeeks.reduce(function (previous, current) {
        return { a: previous.a + current.a, d: previous.d + current.d, c: previous.c + current.c };
      }, defaultAcc);
    });

    var userStats = contribStats[githubName];
    var aggregatedStats = _lodash2.default.transform(contribStats, function (result, value) {
      result.a += value.a;
      result.d += value.d;
      result.c += value.c;
    }, defaultAcc);

    userStats.cpercent = userStats.c / parseFloat(aggregatedStats.c);
    userStats.apercent = userStats.a / parseFloat(aggregatedStats.a);
    userStats.dpercent = userStats.d / parseFloat(aggregatedStats.d);
    overviewPayload.contributors = userStats;
  };

  var response = function response() {
    if (!overviewPayload.success) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(overviewPayload);
  };

  return octo.user.fetch().then(processUser).then(repo.stats.contributors.fetch).then(getRepoStats).then(response).catch(next);
}

function getCommits(req, res, next) {
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

  var retrieveCommits = function retrieveCommits(user) {
    var githubLogin = user.github_login;
    return models.log.commit_log.getUserCommits(githubLogin, projectId, convertedRange);
  };

  var response = function response(commits) {
    res.status(200).json(commits);
  };

  return this.models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

function getCommitsCount(req, res, next) {
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

  var retrieveCommits = function retrieveCommits(user) {
    var githubLogin = user.github_login;
    return models.log.commit_log.getUserCommitsCount(githubLogin, projectId, convertedRange);
  };

  var response = function response(commits) {
    res.status(200).json(commits);
  };

  return this.models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

var githubAPI = { getOverview: getOverview, getCommits: getCommits, getCommitsCount: getCommitsCount };

exports.default = githubAPI;