import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getRepositories(req, res, next) {

}

function getCommits(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(convertedRange)
    .then(response)
    .catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', `commitId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const commitId = req.params.commitId;
  const response = (commit) => {
    if (_.isNil(commit)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId)
    .then(response)
    .catch(next);
}

function getChanges(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (releases) => {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(convertedRange)
    .then(response)
    .catch(next);
}

function getChange(req, res, next) {
  req.checkParams('releaseId', `releaseId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const releaseId = req.params.releaseId;
  const response = (release) => {
    if (_.isNil(release)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId)
    .then(response)
    .catch(next);
}

const githubAPI = { getRepositories, getCommits, getCommit, getChanges, getChange };

export default githubAPI;
