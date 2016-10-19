import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getParticipatingUsers(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.task_log.getParticipatingUsers(convertedRange)
    .then(response)
    .catch(next);
}

function getTasks(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.tasks.getTasks(convertedRange)
    .then(response)
    .catch(next);
}

function getTask(req, res, next) {
  req.checkParams('taskId', `taskId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const taskId = req.params.taskId;

  const response = (task) => {
    if (_.isNil(task)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(task);
  };

  return models.app.task.getTask(taskId)
    .then(response)
    .catch(next);
}

function getActivities(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getActivities(convertedRange)
    .then(response)
    .catch(next);
}

function getTaskActivities(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkParams('taskId', `taskId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const taskId = req.params.taskId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getTaskActivities(null, taskId, convertedRange)
    .then(response)
    .catch(next);
}

const tasksAPI = {
  getParticipatingUsers,
  getTasks,
  getTask,
  getActivities,
  getTaskActivities
};

export default tasksAPI;
