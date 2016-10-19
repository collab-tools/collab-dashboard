import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getMilestones(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const evalQuery = () => {
    return models.app.milestone.getMilestones(convertedRange);
  };
  const response = (milestones) => {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
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

function getActivities(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getActivities(convertedRange)
    .then(response)
    .catch(next);
}

function getMilestoneActivities(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkParams('milestoneId', `milestoneId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const milestoneId = req.params.milestoneId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getMilestoneActivities(milestoneId, convertedRange)
    .then(response)
    .catch(next);
}

const milestonesAPI = {
  getMilestones,
  getMilestone,
  getActivities,
  getMilestoneActivities
};

export default milestonesAPI;
