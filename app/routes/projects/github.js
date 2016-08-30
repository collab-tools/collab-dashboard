import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (info) => {
    if (!info) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json({ info });
  };

  return Promise.all([
    models.log.getProjectRevisions(projectId, null, convertedRange),
    models.app.project.getUsersOfProject(projectId)
  ]).then(response);
}

function getCommits(req, res) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (!commits) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json({ commits });
  };

  return models.log.getProjectRevisions(projectId, null, convertedRange)
      .then(response);
}

function getCommit(req, res) {

}

const githubAPI = { getOverview, getCommits };

export default githubAPI;
