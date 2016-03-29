'use strict';

const moment = require('moment');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  const response = (info) => {
    if (!info) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json({ info });
  };

  return Promise.all([
    models.log['drive-log'].getUniqueFiles(projectId, convertedRange),
    models.log['revision-log'].getProjectRevisions(projectId, convertedRange)
  ]).then(response);
}

function getFiles(req, res) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (files) => {
    if (!files) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(files);
  };

  return models.log['drive-log'].getUniqueFiles(projectId, convertedRange)
      .then(response);
}

function getRevisions(req, res) {
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.query.range = req.query.range || 7;
  req.checkQuery('range', `range ${ERROR_MISSING_TEMPLATE}`).isInt();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date()).subtract(dateRange, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

  const response = (revisions) => {
    if (!revisions) res.boom.badRequest(ERROR_BAD_REQUEST);
    res.json(revisions);
  };

  return models.log['revision-log'].getProjectRevisions(projectId, convertedRange)
      .then(response);
}

const driveAPI = { getOverview, getFiles, getRevisions };

export default driveAPI;
