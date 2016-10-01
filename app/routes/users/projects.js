import _ from 'lodash';
import boom from 'boom';
import Storage from '../../common/storage-helper';

const models = new Storage();
const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getUserProjects(req, res, next) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;

  const retrieveProjects = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(ERROR_BAD_REQUEST));
    return user.getProjects();
  };

  const response = (projects) => {
    res.status(200).json(projects);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveProjects)
    .then(response)
    .catch(next);
}

function getUserProject(req, res, next) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;
  const projectId = req.params.projectId;

  const response = (project) => {
    res.status(200).json({ success: true, projects: project });
  };

  return models.app.project.findProjectById(projectId)
    .then(response)
    .catch(next);
}

const projectsAPI = { getUserProjects, getUserProject };

export default projectsAPI;
