import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getUserFiles(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveFiles = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, null, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getUserChanges(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveChanges = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChanges(email, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveChanges)
    .then(response)
    .catch(next);
}

function getUserActivities(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveActivities = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivities(email, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveActivities)
    .then(response)
    .catch(next);
}

function getProjectFiles(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveFiles = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, projectId, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getProjectChanges(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveChanges = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChangesByProject(email, projectId, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveChanges)
    .then(response)
    .catch(next);
}

function getProjectActivities(req, res, next) {
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

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveActivities = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivitiesByProject(email, projectId, convertedRange);
  };

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveActivities)
    .then(response)
    .catch(next);
}

const driveAPI = {
  getUserFiles,
  getUserChanges,
  getUserActivities,
  getProjectFiles,
  getProjectChanges,
  getProjectActivities
};

export default driveAPI;
