import _ from 'lodash';
import boom from 'boom';
import moment from 'moment';
import constants from '../../common/constants';
import Storage from '../../common/storage-helper';

const models = new Storage();

function getOverview(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (info) => {
    if (_.isNil(info)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ info });
  };

  return Promise.all([
    models.log.getProjectRevisions(projectId, null, convertedRange),
    models.app.project.getUsersOfProject(projectId)
  ]).then(response).catch(next);
}

function getCommits(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.query.range = req.query.range || constants.defaults.range;
  req.checkQuery('range', `range ${constants.templates.error.missingParam}`).isInt();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const dateRange = req.query.range;
  const convertedRange = moment(new Date())
    .subtract(dateRange, 'day')
    .format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ commits });
  };

  return models.log.getProjectRevisions(projectId, null, convertedRange)
    .then(response)
    .catch(next);
}

const githubAPI = { getOverview, getCommits };

export default githubAPI;
