'use strict';
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';

function getUserProjects(req, res) {
  const userId = req.query.userId;
  if (!userId) return res.boom.badRequest(ERROR_BAD_REQUEST);

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

const projectsAPI = { getUserProjects };

export default projectsAPI;
