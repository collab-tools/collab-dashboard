import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

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
  const response = (milestones) => {
    if (!milestones) return res.boom.badRequest(ERROR_BAD_REQUEST);
    return res.json(milestones);
  };

  return models.app.milestone.getMilestones(convertedRange)
      .then(response);
}

function getMilestone(req, res) {
  req.checkParams('milestoneId', `milestoneId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const milestoneId = req.params.milestoneId;
  const response = (milestone) => {
    if (!milestone) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(milestone);
  };

  return models.app.milestone.getMilestone(milestoneId)
      .then(response);
}

const milestonesAPI = { getOverview, getMilestone };

export default milestonesAPI;
