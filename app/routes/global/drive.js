import _ from 'lodash';
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
  const payload = {};

  const processActiveUsers = (activeUsers) => {
    payload.activeUsers = activeUsers;
  };

  const processRevisionsCount = (revisionsCount) => {
    payload.uniqueRevisions = revisionsCount;
  };

  const processFiles = (files) => {
    payload.files = files;
  };

  const processUsersCount = (count) => {
    payload.users = count;
  };

  const response = () => {
    res.json(payload);
  };

  return models.log['revision-log'].getParticipationCount(convertedRange)
      .then(processActiveUsers)
      .then(models.log['drive-log'].getUniqueFiles)
      .then(processFiles)
      .then(_.partial(models.log['revision-log'].getParticipationCount, convertedRange))
      .then(processRevisionsCount)
      .then(models.app.user.getUsersCount)
      .then(processUsersCount)
      .then(response);
}

function getRevisions(req, res) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (commit) => {
    if (!commit) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(commit);
  };

  return models.log['revision-log'].getRevisions(convertedRange)
      .then(response);
}

function getFileRevisions(req, res) {
  req.checkParams('fileId', `fileId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const fileId = req.params.fileId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const response = (revisions) => {
    if (!revisions) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(revisions);
  };

  return models.log['revision-log'].getFileRevisions(fileId, convertedRange)
      .then(response);
}

function getFile(req, res) {
  req.checkParams('fileId', `fileId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const fileId = req.params.fileId;
  const response = (file) => {
    if (!file) res.boom.badRequest(file);
    return res.json(file);
  };

  return models.log['drive-log'].getFile(fileId)
      .then(response);
}

const driveAPI = { getOverview, getRevisions, getFileRevisions, getFile };

export default driveAPI;
