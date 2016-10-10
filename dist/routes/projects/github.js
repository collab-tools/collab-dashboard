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

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(info) {
    if (_lodash2.default.isNil(info)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json({ info: info });
  };

  return Promise.all([models.log.getProjectRevisions(projectId, null, convertedRange), models.app.project.getUsersOfProject(projectId)]).then(response).catch(next);
}

function getCommits(req, res, next) {
  req.checkParams('projectId', 'projectId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var projectId = req.params.projectId;
  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commits) {
    if (_lodash2.default.isNil(commits)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json({ commits: commits });
  };

  return models.log.getProjectRevisions(projectId, null, convertedRange).then(response).catch(next);
}

var githubAPI = { getOverview: getOverview, getCommits: getCommits };

exports.default = githubAPI;