'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _download = require('download');

var _download2 = _interopRequireDefault(_download);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _constants = require('../../common/constants');

var _constants2 = _interopRequireDefault(_constants);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

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

function getParticipatingProjects(req, res, next) {
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

  return models.log.commit_log.getParticipatingProjects(startDate, endDate).then(response).catch(next);
}

function downloadAssets(req, res, next) {
  var releases = JSON.parse(req.query.releases);
  var archive = (0, _archiver2.default)('zip');
  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });
  archive.on('end', function () {
    console.log('Archive wrote %d bytes', archive.pointer());
  });
  res.attachment('releases-assets.zip');

  // flatten assets
  var assets = [];
  _lodash2.default.forEach(releases, function (release) {
    _lodash2.default.forEach(release.assets, function (asset) {
      assets.push({
        fileName: asset,
        directory: release.owner + '-' + release.repo + '-' + release.tagName,
        url: 'https://github.com/' + release.owner + '/' + release.repo + '/releases/download/' + release.tagName + '/' + asset
      });
    });
  });

  Promise.all(_lodash2.default.map(assets, function (asset) {
    return (0, _download2.default)(asset.url);
  })).then(function (payload) {
    // download files
    archive.pipe(res);
    _lodash2.default.forEach(assets, function (asset, index) {
      archive.append(payload[index], { name: asset.directory + '/' + asset.fileName });
    });
    archive.finalize();
  });
}

var githubAPI = {
  getRepositories: getRepositories,
  getCommits: getCommits,
  getCommit: getCommit,
  getReleases: getReleases,
  getRelease: getRelease,
  getParticipatingUsers: getParticipatingUsers,
  getParticipatingProjects: getParticipatingProjects,
  downloadAssets: downloadAssets
};

exports.default = githubAPI;