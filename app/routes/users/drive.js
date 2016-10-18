import boom from 'boom';
import Promise from 'bluebird';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');


  const retrieveFilesAndRevisions = (user) => {
    const googleId = user.google_id;
    const promiseArray = [
      models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange),
      models.log.revision_log.getUserRevisions(googleId, null, convertedRange)
    ];
    return Promise.all(promiseArray);
  };

  const response = (query) => {
    const payload = {
      files: query[0],
      revisions: query[1]
    };
    res.status(200).json(payload);
  };

  return Storage.app.user.getUserById(userId)
    .then(retrieveFilesAndRevisions)
    .then(response)
    .catch(next);
}

function getFiles(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveFiles = (user) => {
    const googleId = user.google_id;
    return models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange);
  };

  const response = (files) => {
    res.status(200).json(files);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getFilesCount(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveFiles = (user) => {
    const googleId = user.google_id;
    return models.log.drive_log.getUniqueFiles(projectId, googleId, convertedRange);
  };

  const response = (files) => {
    res.status(200).json({ count: files.length });
  };

  return models.app.user.getUserById(userId)
    .then(retrieveFiles)
    .then(response)
    .catch(next);
}

function getRevisions(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveRevisions = (user) => {
    const googleId = user.google_id;
    return models.log.revision_log.getUserRevisionsByProject(googleId,
      projectId, null, convertedRange);
  };

  const response = (revisions) => {
    res.status(200).json(revisions);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveRevisions)
    .then(response)
    .catch(next);
}

function getRevisionsCount(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const retrieveRevisions = (user) => {
    const googleId = user.google_id;
    return models.log.revision_log.getUserRevisionsByProject(googleId,
      projectId, null, convertedRange);
  };

  const response = (revisions) => {
    res.status(200).json({ count: revisions.length });
  };

  return models.app.user.getUserById(userId)
    .then(retrieveRevisions)
    .then(response)
    .catch(next);
}

const driveAPI = {
  getOverview,
  getRevisions,
  getRevisionsCount,
  getFiles,
  getFilesCount
};

export default driveAPI;
