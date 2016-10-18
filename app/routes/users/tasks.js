import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.query.projectId;
  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const processLogs = (logs) => {
    const payload = { tasks: {} };
    if (_.isNil(logs)) return next(boom.badRequest(constants.templates.error.badRequest));
    payload.logs = logs;

    // Pseudo-map data structure to avoid duplicate pulls from database
    logs.forEach((log) => {
      log = log.toJSON();
      payload.tasks[log.taskId] = true;
    });

    const relevantTasks = [];
    _.forOwn(payload.tasks, (value, key) => {
      relevantTasks.push(models.app.task.getTask(key));
    });

    // Retrieve all tasks referenced by log
    return Promise.all(relevantTasks)
      .then((tasks) => {
        tasks.forEach((task) => {
          task = task.toJSON();
          payload.tasks[task.id] = task;
        });
        return payload;
      });
  };

  const response = (payload) => {
    res.status(200).json(payload);
  };

  return models.log.task_log.getByProject(userId, projectId, convertedRange)
    .then(processLogs)
    .then(response)
    .catch(next);
}


function getTasksAssigned(req, res, next) {
  req.checkParams('userId', constants.templates.error.badRequest).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', constants.templates.error.badRequest).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range || 7;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (tasks) => {
    res.status(200).json(tasks);
  };

  return models.app.tasks.getTasksByAssignee(userId, projectId, convertedRange)
    .then(response)
    .catch(next);
}

const tasksAPI = { getOverview, getTasksAssigned };

export default tasksAPI;
