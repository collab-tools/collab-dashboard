import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const processPayload = ([activeUsersCount, revisions, files, usersCount, projectsCount]) => {
    const payload = {};
    payload.activeUsersCount = activeUsersCount;
    payload.revisions = revisions;
    payload.files = files;
    payload.usersCount = usersCount;
    payload.projectsCount = projectsCount;
    return payload;
  };

  const response = (payload) => {
    if (_.isNil(payload)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(payload);
  };

  const retrievalFunctions = [
    models.log.revision_log.getParticipationCount(convertedRange),
    models.log.revision_log.getRevisions(convertedRange),
    models.log.drive_log.getUniqueFiles(null, null, convertedRange),
    models.app.user.getUsersCount(convertedRange),
    models.app.project.getProjectsCount(convertedRange)
  ];

  return Promise.all(retrievalFunctions)
    .then(processPayload)
    .then(response)
    .catch(next);
}

function getRevisions(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (commit) => {
    if (_.isNil(commit)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(commit);
  };

  return models.log.revision_log.getRevisions(convertedRange)
    .then(response)
    .catch(next);
}

function getFileRevisions(req, res, next) {
  req.checkParams('fileId', `fileId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const fileId = req.params.fileId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (revisions) => {
    if (_.isNil(revisions)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(revisions);
  };

  return models.log.revision_log.getFileRevisions(fileId, convertedRange)
    .then(response)
    .catch(next);
}

function getFile(req, res, next) {
  req.checkParams('fileId', `fileId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const fileId = req.params.fileId;
  const response = (file) => {
    if (_.isNil(file)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(file);
  };

  return models.log.drive_log.getFile(fileId)
    .then(response)
    .catch(next);
}

const driveAPI = { getOverview, getRevisions, getFileRevisions, getFile };

export default driveAPI;
