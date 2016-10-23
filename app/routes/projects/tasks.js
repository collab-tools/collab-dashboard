import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getTasks(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasksByProject(projectId, convertedRange)
    .then(response)
    .catch(next);
}

function getActivities(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (tasksActivities) => {
    if (_.isNil(tasksActivities)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    res.status(200).json(tasksActivities);
  };

  return models.log.task_log.getProjectActivities(projectId, convertedRange)
    .then(response)
    .catch(next);
}

const tasksAPI = { getTasks, getActivities };

export default tasksAPI;
