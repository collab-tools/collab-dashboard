'use strict';
const _ = require('lodash');
const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.query.projectId;
  const userId = req.params.userId;
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

  return models.log['task-log'].getByUserProject(userId, projectId, convertedRange)
      .then(processLogs)
      .then(response);
}


function getTasksAssigned(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', ERROR_BAD_REQUEST).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range || 7;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (tasks) => {
    return res.json(tasks);
  };

  return models.app.tasks.getTasksByAssignee(userId, projectId, convertedRange)
      .then(response);
}

const tasksAPI = { getOverview, getTasksAssigned };

export default tasksAPI;
