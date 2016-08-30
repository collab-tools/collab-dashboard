import Promise from 'bluebird';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();


const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');


  const retrieveFilesAndRevisions = (user) => {
    const googleId = user.google_id;
    const promiseArray = [
      models.log['drive-log'].getUniqueFiles(projectId, googleId, convertedRange),
      models.log['revision-log'].getUserRevisions(googleId, null, convertedRange)
    ];
    return Promise.all(promiseArray);
  };

  const response = (query) => {
    const payload = {
      files: query[0],
      revisions: query[1]
    };
    res.json(payload);
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveFilesAndRevisions)
      .then(response)
      .catch(errorHandler);
}

function getFiles(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveFiles = (user) => {
    const googleId = user.google_id;
    return models.log['drive-log'].getUniqueFiles(projectId, googleId, convertedRange);
  };

  const response = (files) => {
    res.json(files);
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveFiles)
      .then(response)
      .catch(errorHandler);
}

function getFilesCount(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveFiles = (user) => {
    const googleId = user.google_id;
    return models.log['drive-log'].getUniqueFiles(projectId, googleId, convertedRange);
  };

  const response = (files) => {
    res.json({ count: files.length });
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveFiles)
      .then(response)
      .catch(errorHandler);
}

function getRevisions(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveRevisions = (user) => {
    const googleId = user.google_id;
    return models.log['revision-log'].getUserRevisionsByProject(googleId,
      projectId, null, convertedRange);
  };

  const response = (revisions) => {
    res.json(revisions);
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveRevisions)
      .then(response)
      .catch(errorHandler);
}

function getRevisionsCount(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkQuery('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.boom.badRequest(errors);

  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const retrieveRevisions = (user) => {
    const googleId = user.google_id;
    return models.log['revision-log'].getUserRevisionsByProject(googleId,
      projectId, null, convertedRange);
  };

  const response = (revisions) => {
    res.json({ count: revisions.length });
  };

  const errorHandler = () => {
    res.boom.badRequest(ERROR_BAD_REQUEST);
  };

  return this.models.app.user.getUserById(userId)
      .then(retrieveRevisions)
      .then(response)
      .catch(errorHandler);
}

const driveAPI = {
  getOverview, getRevisions, getRevisionsCount, getFiles, getFilesCount
};

export default driveAPI;
