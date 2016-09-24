import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import Storage from '../../common/storage-helper';

const models = new Storage();

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');
  const response = (info) => {
    if (_.isNil(info)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json({ info });
  };

  return Promise.all([
    models.log.drive_log.getUniqueFiles(projectId, convertedRange),
    models.log.revision_log.getProjectRevisions(projectId, convertedRange)
  ]).then(response).catch(next);
}

function getFiles(req, res, next) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (files) => {
    if (_.isNil(files)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(files);
  };

  return models.log.drive_log.getUniqueFiles(projectId, convertedRange)
    .then(response)
    .catch(next);
}

function getRevisions(req, res, next) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (revisions) => {
    if (_.isNil(revisions)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(revisions);
  };

  return models.log.revision_log.getProjectRevisions(projectId, convertedRange)
    .then(response)
    .catch(next);
}

const driveAPI = { getOverview, getFiles, getRevisions };

export default driveAPI;
