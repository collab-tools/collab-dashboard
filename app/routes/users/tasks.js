'use strict';
const _ = require('lodash');
const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';

function getOverview(req, res) {
  const projectId = req.query.projectId;
  const userId = req.params.userId;
  const dateRange = req.query.range || 7;
  if (!userId || !projectId || !_.isInteger(dateRange)) res.boom.badRequest(ERROR_BAD_REQUEST);
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

const tasksAPI = { getOverview };

export default tasksAPI;
