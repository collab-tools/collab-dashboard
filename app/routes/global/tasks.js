import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest('test', errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (data) => {
    if (_.isNil(data)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ count: data.count, activities: data.rows });
  };

  return models.log.task_log.getByRange(convertedRange)
    .then(response)
    .catch(next);
}

function getTasks(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  if (_.isUndefined(req.query.count)) req.checkQuery('count', constants.templates.error.badRequest).isBoolean();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const evalQuery = () => {
    if (req.query.count) return models.app.task.getCount(convertedRange);
    return models.app.tasks.getTasks(convertedRange);
  };
  const response = (data) => {
    if (_.isNil(data)) return next(boom.badRequest(constants.templates.error.badRequest));
    const payload = (req.query.count) ? { count: data } : { tasks: data };
    res.status(200).json(payload);
  };

  return evalQuery()
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

const tasksAPI = { getOverview, getTasks, getTask };

export default tasksAPI;
