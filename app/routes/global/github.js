'use strict';

const _ = require('lodash');
const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

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

function getCommit(req, res) {
  req.checkParams('commitId', `commitId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const commitId = req.params.commitId;
  const response = (commit) => {
    if (!commit) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(commit);
  };

  return models.log['commit-log'].getCommit(commitId)
    .then(response);
}

const githubAPI = { getOverview, getCommit };

export default githubAPI;
