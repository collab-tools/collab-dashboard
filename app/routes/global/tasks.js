'use strict';

const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const response = (tasks) => {
    if (!tasks) return res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(tasks);
  };

  return models.app.task.getTasks(convertedRange)
      .then(response);
}

function getTask(req, res) {
  req.checkParams('taskId', `milestoneId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const taskId = req.params.taskId;
  const response = (task) => {
    if (!task) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(task);
  };

  return models.app.task.getTask(taskId)
      .then(response);
}

const tasksAPI = { getOverview, getTask };

export default tasksAPI;
