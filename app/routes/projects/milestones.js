import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  if (req.query.elapsed) {
    req.checkQuery('elapsed', `elapsed ${constants.templates.error.invalidData}`).isBoolean();
  }
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const elapsed = JSON.parse(req.query.elapsed);
  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');
  const evalQuery = () => {
    if (elapsed) {
      return models.app.milestone.getElapsedMilestonesByProject(projectId, startDate, endDate);
    }
    return models.app.milestone.getMilestonesByProject(projectId, startDate, endDate);
  };
  const response = (milestones) => {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return evalQuery()
    .then(response)
    .catch(next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (milestonesActivities) => {
    if (_.isNil(milestonesActivities)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    res.status(200).json(milestonesActivities);
  };

  return models.log.milestone_log.getProjectActivities(projectId, startDate, endDate)
    .then(response)
    .catch(next);
}

function getTasksByMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const groupByMilestone = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  const response = (groupedTasks) => {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByProject(projectId, startDate, endDate)
    .then(groupByMilestone)
    .then(response)
    .catch(next);
}

const milestonesAPI = { getMilestones, getActivities, getTasksByMilestones };

export default milestonesAPI;
