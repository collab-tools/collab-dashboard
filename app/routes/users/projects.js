import Storage from '../../common/storage-helper';

const models = new Storage();
const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getUserProjects(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const userId = req.params.userId;

  const retrieveProjects = (user) => {
    if (!user) return res.boom.badRequest(ERROR_BAD_REQUEST);
    return user.getProjects();
  };

  const response = (projects) => {
    return res.json(projects);
  };

  return models.app.user.getUserById(userId)
      .then(retrieveProjects)
      .then(response);
}

function getUserProject(req, res) {
  req.checkParams('userId', `userId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  req.checkParams('projectId', `projectId ${ERROR_MISSING_TEMPLATE}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) res.json(errors, 400);

  const userId = req.params.userId;
  const projectId = req.params.projectId;

  const response = (project) => {
    return res.json({ success: true, projects: project });
  };
  return models.app.project.findProjectById(projectId)
      .then(response);
}

const projectsAPI = { getUserProjects, getUserProject };

export default projectsAPI;
