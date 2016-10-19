import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getProject(req, res, next) {
  req.query.getUser = req.query.getUser || false;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('getUser', `range ${constants.templates.error.missingParam}`).isBoolean();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.body.projectId;
  const getUser = req.query.getUser;
  const response = (project) => {
    if (_.isNil(project)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(project);
  };

  let retrievalFunc = 'findProjectById';
  if (getUser) retrievalFunc = 'getProjectWithMembers';

  return models.app.project[retrievalFunc](projectId)
    .then(response)
    .catch(next);
}

function getProjects(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.query.getUser = req.query.getUser || false;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  req.checkQuery('getUser', `range ${constants.templates.error.missingParam}`).isBoolean();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const getUser = req.query.getUser;
  const response = (projects) => {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projects);
  };

  let retrievalFunc = 'getProjects';
  if (getUser) retrievalFunc = 'getProjectsWithMembers';

  return models.app.project[retrievalFunc](convertedRange)
    .then(response)
    .catch(next);
}

function getProjectsCount(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (projectsCount) => {
    if (_.isNil(projectsCount)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projectsCount);
  };
  return models.app.project.getProjectsCount(convertedRange)
    .then(response)
    .catch(next);
}

const teamsAPI = { getProject, getProjects, getProjectsCount };

export default teamsAPI;
