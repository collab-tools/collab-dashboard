import _ from 'lodash';
import boom from 'boom';
import config from 'config';
import moment from 'moment';
import octokat from 'octokat';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

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
      .then((commits) => {
        overviewPayload.commits = commits;
      });
  };

  const getRepoStats = (contributors) => {
    const contribStats = {};
    const defaultAcc = { a: 0, d: 0, c: 0 };

    contributors.forEach((contributor) => {
      const rangeWeeks = since ? _.filter(contributor.weeks, (week) => {
        return week.w >= since;
      }) : contributor.weeks;
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
    if (!overviewPayload.success) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(overviewPayload);
  };

  return octo.user.fetch()
    .then(processUser)
    .then(repo.stats.contributors.fetch)
    .then(getRepoStats)
    .then(response)
    .catch(next);
}

function getCommits(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveCommits = (user) => {
    const githubLogin = user.github_login;
    return models.log.commit_log.getUserCommits(githubLogin, projectId, convertedRange);
  };

  const response = (commits) => {
    res.status(200).json(commits);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveCommits)
    .then(response)
    .catch(next);
}

function getCommitsCount(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveCommits = (user) => {
    const githubLogin = user.github_login;
    return models.log.commit_log.getUserCommitsCount(githubLogin, projectId, convertedRange);
  };

  const response = (commits) => {
    res.status(200).json(commits);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveCommits)
    .then(response)
    .catch(next);
}

const githubAPI = { getOverview, getCommits, getCommitsCount };

export default githubAPI;
