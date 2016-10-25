import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getTasks(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasks(startDate, endDate)
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
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getActivities(startDate, endDate)
    .then(response)
    .catch(next);
}

function getTaskActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('taskId', `taskId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const taskId = req.params.taskId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getTaskActivities(null, taskId, startDate, endDate)
    .then(response)
    .catch(next);
}

function getParticipatingUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.task_log.getParticipatingUsers(startDate, endDate)
    .then(response)
    .catch(next);
}

const tasksAPI = {
  getTasks,
  getTask,
  getActivities,
  getTaskActivities,
  getParticipatingUsers
};

export default tasksAPI;
