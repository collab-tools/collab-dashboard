import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (data) => {
    if (data == null) return res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json({ count: data.count, activities: data.rows });
  };

  return models.log.task_log
    .getByRange(convertedRange)
    .then(response);
}

function getTasks(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  if (req.query.count !== undefined) req.checkQuery('count', ERROR_BAD_REQUEST).isBoolean();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const evalQuery = () => {
    if (req.query.count) return models.app.task.getCount(convertedRange);
    return models.app.tasks.getTasks(convertedRange);
  };
  const response = (data) => {
    if (data == null) return res.boom.badRequest(ERROR_BAD_REQUEST);
    const payload = (req.query.count) ? { count: data } : { tasks: data };
    return res.json(payload);
  };

  return evalQuery()
    .then(response);
}

function getTask(req, res) {
  req.checkParams('taskId', `taskId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return res.status(400).json(errors);

  const taskId = req.params.taskId;
  const response = (task) => {
    if (task == null) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(task);
  };

  return models.app.task
    .getTask(taskId)
    .then(response);
}

const tasksAPI = { getOverview, getTasks, getTask };

export default tasksAPI;
