import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const processPayload = ([reposCount, commits, releases, usersCount]) => {
    const payload = {};
    payload.reposCount = reposCount;
    payload.commits = commits;
    payload.releases = releases;
    payload.usersCount = usersCount;
    return payload;
  };

  const response = (payload) => {
    if (_.isNil(payload)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(payload);
  };

  const retrievalFunctions = [
    models.app.project.getRepositoriesCount(convertedRange),
    models.log.commit_log.getCommits(convertedRange),
    models.log.release_log.getReleases(convertedRange),
    models.app.user.getUsersCount(convertedRange)
  ];

  return Promise.all(retrievalFunctions)
    .then(processPayload)
    .then(response)
    .catch(next);
}

function getCommits(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (_.isNil(commits)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(convertedRange)
    .then(response)
    .catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', `commitId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const commitId = req.params.commitId;
  const response = (commit) => {
    if (_.isNil(commit)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId)
    .then(response)
    .catch(next);
}

function getReleases(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (releases) => {
    if (_.isNil(releases)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(convertedRange)
    .then(response)
    .catch(next);
}

function getRelease(req, res, next) {
  req.checkParams('releaseId', `releaseId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const releaseId = req.params.releaseId;
  const response = (release) => {
    if (_.isNil(release)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId)
    .then(response)
    .catch(next);
}

const githubAPI = { getOverview, getCommits, getCommit, getReleases, getRelease };

export default githubAPI;
