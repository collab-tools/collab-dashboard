import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getUserFiles(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveFiles = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, null, startDate, endDate);
  };

  const response = (files) => {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getUserChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveChanges = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChanges(email, startDate, endDate);
  };

  const response = (changes) => {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveChanges)
    .then(response)
    .catch(next);
}

function getUserActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveActivities = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivities(email, startDate, endDate);
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
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveFiles = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, projectId, startDate, endDate);
  };

  const response = (files) => {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getProjectChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveChanges = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChangesByProject(email, projectId, startDate, endDate);
  };

  const response = (changes) => {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveGoogleIdentity)
    .then(retrieveChanges)
    .then(response)
    .catch(next);
}

function getProjectActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const retrieveGoogleIdentity = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  const retrieveActivities = (email) => {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivitiesByProject(email, projectId, startDate, endDate);
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
