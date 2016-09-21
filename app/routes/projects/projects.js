import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getProject(req, res) {
  req.query.getUser = req.query.getUser || false;
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('getUser', `range ${ERROR_MISSING_TEMPLATE}`).isBoolean();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const projectId = req.body.projectId;
  const getUser = req.query.getUser;
  const response = (project) => {
    if (!project) res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(project);
  };

  let retrievalFunc = models.app.projects.findProjectById;
  if (getUser) retrievalFunc = models.app.projects.getProjectWithMembers;

  return retrievalFunc(projectId).then(response);
}

function getProjects(req, res) {
  req.query.range = req.query.range || 7;
  req.query.getUser = req.query.getUser || false;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  req.checkQuery('getUser', `range ${ERROR_MISSING_TEMPLATE}`).isBoolean();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const getUser = req.query.getUser;
  const response = (projects) => {
    if (!projects) res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(projects);
  };

  let retrievalFunc = models.app.projects.getProjects;
  if (getUser) retrievalFunc = models.app.projects.getProjectsWithMembers;

  return retrievalFunc(convertedRange).then(response);
}

function getProjectsCount(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const response = (projectsCount) => {
    if (!projectsCount) return res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(projectsCount);
  };
  return models.app.getProjectsCount(convertedRange)
      .then(response);
}

const teamsAPI = { getProject, getProjects, getProjectsCount };

export default teamsAPI;
