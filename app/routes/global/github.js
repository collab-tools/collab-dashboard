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
  const payload = {};

  const processRepos = (repos) => {
    payload.repos = repos;
  };

  const processCommits = (commits) => {
    payload.commits = commits;
  };

  const response = () => {
    res.status(200).json(payload);
  };

  return models.app.project.getRepositories(convertedRange)
    .then(processRepos)
    .then(_.partial(models.log.commit_log.getCommits(convertedRange)))
    .then(processCommits)
    .then(response)
    .catch(next);
}

function getCommits(req, res, next) {

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

function getRelease(req, res, next) {

}

function getReleases(req, res, next) {

}

const githubAPI = { getOverview, getCommits, getCommit, getReleases, getRelease };

export default githubAPI;
