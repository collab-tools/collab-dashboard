/**
 * Service Factory that creates object that represent HTTP services
 * for /api/projects Resources.
 * @namespace ProjectsFactory
 */

(() => {
  angular
    .module('app')
    .factory('Projects', projectsFactory);

  projectsFactory.$inject = ['$http'];

  function projectsFactory($http) {
    const urlBase = '/api/projects';
    const projectsFactory = {
      github: {},
      drive: {},
      tasks: {},
      milestones: {},
      cloud: {}
    };

    projectsFactory.getProjects = (range) => {
      return $http.get(`${urlBase}?range=${range}`);
    };

    projectsFactory.getProject = (projectId) => {
      return $http.get(`${urlBase}/${projectId}`);
    };

    projectsFactory.getUsers = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/users`);
    };

    projectsFactory.github.getRepo = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/github/repo`);
    };

    projectsFactory.github.getCommits = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/github/commits?range=${range}`);
    };

    projectsFactory.github.getReleases = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/github/releases?range=${range}`);
    };

    projectsFactory.github.getContributors = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/github/contributors`);
    };

    projectsFactory.github.getStatistics = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/github/stats`);
    };

    projectsFactory.drive.getFiles = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/drive/files?range=${range}`);
    };

    projectsFactory.drive.getChanges = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/drive/changes?range=${range}`);
    };

    projectsFactory.drive.getActivities = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/drive/activities?range=${range}`);
    };

    projectsFactory.tasks.getTasks = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/tasks?range=${range}`);
    };

    projectsFactory.tasks.getActivities = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/tasks/activities?range=${range}`);
    };

    projectsFactory.milestones.getMilestones = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/milestones?range=${range}`);
    };

    projectsFactory.milestones.getActivities = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/milestones/activities?range=${range}`);
    };

    projectsFactory.milestones.getTasksByMilestones = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/milestones/tasks?range=${range}`);
    };

    projectsFactory.cloud.getOverview = (projectId, range) => {
      return $http.get(`${urlBase}/${projectId}/cloud/overview?range=${range}`);
    };

    return projectsFactory;
  }
})();
