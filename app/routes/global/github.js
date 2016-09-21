import _ from 'lodash';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const payload = {};

  const processRepos = (repos) => {
    payload.repos = repos;
  };

  const getCommits = (commits) => {
    payload.commits = commits;
  };

  const response = () => {
    res.json(payload);
  };

  return models.app.project.getRepositories(convertedRange)
    .then(processRepos)
    .then(_.partial(models.log['commit-log'].getCommits(convertedRange)))
    .then(getCommits)
    .then(response);
}

function getCommits(req, res) {

}

function getCommit(req, res) {
  req.checkParams('commitId', `commitId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const commitId = req.params.commitId;
  const response = (commit) => {
    if (!commit) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(commit);
  };

  return models.log['commit-log'].getCommit(commitId)
    .then(response);
}

function getRelease(req, res) {

}

function getReleases(req, res) {

}

const githubAPI = { getOverview, getCommit, getReleases, getRelease };

export default githubAPI;
