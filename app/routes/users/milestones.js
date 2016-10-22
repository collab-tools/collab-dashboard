import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Promise from 'bluebird';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getAssignedUserMilestones(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveMilestonesInvolved = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    const retrieval = [];
    _.flow(
      _.uniqBy('milestoneId'),
      _.pick('milestoneId'),
      _.compact,
      _.forEach((id) => { retrieval.push(models.app.milestone.getMilestone(id)); })
    )(tasks);
    return Promise.all(retrieval);
  };

  const response = (milestones) => {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return models.app.task.getTasksByAssignee(userId, null, convertedRange)
    .then(retrieveMilestonesInvolved)
    .then(response)
    .catch(next);
}

function getUserMilestones(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveMilestones = (projects) => {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    const retrieval = [];
    _.forEach(projects, (project) => {
      retrieval.push(models.app.milestone.getMilestonesByProject(project.id, convertedRange));
    });
    return Promise.all(retrieval);
  };

  const response = (milestones) => {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    const groupedMilestones = _.flow(_.flatten, _.groupBy('milestoneId'))(milestones);
    res.status(200).json(groupedMilestones);
  };

  return models.app.user.getUserProjects(userId)
    .then(retrieveMilestones)
    .then(response)
    .catch(next);
}

function getTasksByMilestones(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const groupByMilestone = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  const response = (groupedTasks) => {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, null, convertedRange)
    .then(groupByMilestone)
    .then(response)
    .catch(next);
}

function getTasksByProjectMilestones(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.invalidData}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const groupByMilestone = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  const response = (groupedTasks) => {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, convertedRange)
    .then(groupByMilestone)
    .then(response)
    .catch(next);
}

const milestonesAPI = {
  getAssignedUserMilestones,
  getUserMilestones,
  getTasksByMilestones,
  getTasksByProjectMilestones
};

export default milestonesAPI;
