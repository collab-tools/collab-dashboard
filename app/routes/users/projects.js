import _ from 'lodash';
import boom from 'boom';
import Storage from '../../common/storage-helper';

const models = new Storage();
const constants.templates.error.badRequest = 'Unable to serve your content. Check your arguments.';
const constants.templates.error.missingParam = 'is a required parameter in GET request.';

function getUserProjects(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;

  const retrieveProjects = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
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
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
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
