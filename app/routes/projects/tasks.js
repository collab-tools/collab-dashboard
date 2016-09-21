import _ from 'lodash';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const processLogs = (logs) => {
    const payload = { tasks: {} };
    if (!logs) return res.boom.badRequest(ERROR_BAD_REQUEST);
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
    res.json(payload);
  };

  return models.log['task-log'].getByProject(projectId, convertedRange)
      .then(processLogs)
      .then(response);
}

function getTasks(req, res) {
  req.query.range = req.query.range || 7;
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const response = (tasks) => {
    if (!tasks) res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(tasks);
  };

  return models.app.task.getTasksByProject(projectId, convertedRange)
      .then(response);
}

const tasksAPI = { getOverview, getTasks };

export default tasksAPI;
