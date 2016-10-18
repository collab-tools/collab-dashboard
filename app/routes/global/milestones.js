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
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (data) => {
    if (_.isNil(data)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ count: data.count, activities: data.rows });
  };

  return models.log.milestone_log.getByRange(convertedRange)
    .then(response)
    .catch(next);
}

function getMilestones(req, res, next) {
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
    if (req.query.count) return models.app.milestone.getCount(convertedRange);
    return models.app.milestone.getMilestones(convertedRange);
  };
  const response = (data) => {
    if (_.isNil(data)) return next(boom.badRequest(constants.templates.error.badRequest));
    const payload = (req.query.count) ? { count: data } : { milestones: data };
    res.status(200).json(payload);
  };

  return evalQuery()
    .then(response)
    .catch(next);
}

function getMilestone(req, res, next) {
  req.checkParams('milestoneId', `milestoneId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const milestoneId = req.params.milestoneId;
  const response = (milestone) => {
    if (_.isNil(milestone)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestone);
  };

  return models.app.milestone.getMilestone(milestoneId)
    .then(response)
    .catch(next);
}

const milestonesAPI = {
  getOverview,
  getMilestones,
  getMilestone
};

export default milestonesAPI;
