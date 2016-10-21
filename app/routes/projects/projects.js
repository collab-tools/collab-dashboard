import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getProject(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const response = (project) => {
    if (_.isNil(project)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(project);
  };

  return models.app.project.findProjectById(projectId)
    .then(response)
    .catch(next);
}

function getProjects(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (projects) => {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projects);
  };

  return models.app.project.getProjects(convertedRange)
    .then(response)
    .catch(next);
}

function getUsers(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.project.getUsersOfProject(projectId)
    .then(response)
    .catch(next);
}

const teamsAPI = { getProject, getProjects, getUsers };

export default teamsAPI;
