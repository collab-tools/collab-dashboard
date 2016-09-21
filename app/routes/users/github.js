import _ from 'lodash';
import config from 'config';
import moment from 'moment';
import octokat from 'octokat';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;

  // Access GitHub with user's token and retrieve relevant statistics
  // Dev Token for testing purposes
  const token = config.github_dev;
  const mockOwner = 'collab-tools';
  const mockProject = 'collab-dashboard';
  const mockRange = 'month';

  // Setup GitHub wrapper to retrieve information from GitHub
  const octoConfig = { token };
  const octo = octokat(octoConfig);
  const repo = octo.repos(mockOwner, mockProject);
  const overviewPayload = { success: true };
  let since = null; // Default - Everything
  if (mockRange === 'month') since = moment().startOf('month').format('X');
  else if (mockRange === 'week') since = moment().startOf('week').format('X');
  let githubName;

  const processUser = (user) => {
    githubName = user.login;

    // Get all commits of the user and process
    return repo.commits.fetch({ since, author: githubName })
        .then(commits => {
          overviewPayload.commits = commits;
        });
  };

  const getRepoStats = (contributors) => {
    const contribStats = {};
    const defaultAcc = { a: 0, d: 0, c: 0 };

    contributors.forEach((contributor) => {
      const rangeWeeks = since ? _.filter(contributor.weeks, (week) => week.w >= since) : contributor.weeks;
      contribStats[contributor.author.login] = rangeWeeks.reduce((previous, current) =>
              ({ a: (previous.a + current.a), d: (previous.d + current.d), c: previous.c + current.c }),
          defaultAcc);
    });

    const userStats = contribStats[githubName];
    const aggregatedStats = _.transform(contribStats, (result, value) => {
      result.a += value.a;
      result.d += value.d;
      result.c += value.c;
    }, defaultAcc);

    userStats.cpercent = userStats.c / parseFloat(aggregatedStats.c);
    userStats.apercent = userStats.a / parseFloat(aggregatedStats.a);
    userStats.dpercent = userStats.d / parseFloat(aggregatedStats.d);
    overviewPayload.contributors = userStats;
  };

  const response = () => {
    if (overviewPayload.success) res.json(overviewPayload);
    else res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  const handleError = (error) => {
    console.log(error);
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return octo.user.fetch()
      .then(processUser)
      .then(repo.stats.contributors.fetch)
      .then(getRepoStats)
      .then(response)
      .catch(handleError);
}

function getCommits(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveCommits = (user) => {
    const githubLogin = user.github_login;
    return models.log['commit-log'].getUserCommits(githubLogin, projectId, convertedRange);
  };

  const response = (commits) => {
    res.json(commits);
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveCommits)
      .then(response)
      .catch(errorHandler);
}

function getCommitsCount(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveCommits = (user) => {
    const githubLogin = user.github_login;
    return models.log['commit-log'].getUserCommitsCount(githubLogin, projectId, convertedRange);
  };

  const response = (commits) => {
    res.json(commits);
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveCommits)
      .then(response)
      .catch(errorHandler);
}

const githubAPI = { getOverview, getCommits, getCommitsCount };

export default githubAPI;
