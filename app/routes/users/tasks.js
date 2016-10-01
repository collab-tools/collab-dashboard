import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
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
    if (_.isNil(logs)) return next(boom.badRequest(ERROR_BAD_REQUEST));
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
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', ERROR_BAD_REQUEST).isInt();
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
