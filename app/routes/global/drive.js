import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const ERROR_INVALID_DATA = 'contains a invalid data type.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getParticipatingUsers(req, res, next) {
  req.query.count = req.query.count || false;
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('count', `count ${ERROR_INVALID_DATA}`).isBoolean();
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({
      count: users.length,
      users
    });
  };

  return models.log.file_log.getParticipatingUsers(convertedRange)
    .then(response)
    .catch(next);
}


function getChanges(req, res, next) {
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (commit) => {
    if (_.isNil(commit)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commit);
  };

  return models.log.revision_log.getRevisions(convertedRange)
    .then(response)
    .catch(next);
}

function getFileChanges(req, res, next) {
  req.checkParams('fileId', `fileId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const fileId = req.params.fileId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (revisions) => {
    if (_.isNil(revisions)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(revisions);
  };

  return models.log.revision_log.getFileRevisions(fileId, convertedRange)
    .then(response)
    .catch(next);
}

function getFile(req, res, next) {
  req.checkParams('fileId', `fileId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const fileId = req.params.fileId;
  const response = (file) => {
    if (_.isNil(file)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(file);
  };

  return models.log.drive_log.getFile(fileId)
    .then(response)
    .catch(next);
}

const driveAPI = { getParticipatingUsers, getChanges, getFileChanges, getFile };

export default driveAPI;
