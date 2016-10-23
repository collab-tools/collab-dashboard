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

    projectsFactory.getProjects = (start, end) => {
      return $http.get(`${urlBase}?start=${start}&end=${end}`);
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

    projectsFactory.github.getCommits = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/github/commits?start=${start}&end=${end}`);
    };

    projectsFactory.github.getReleases = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/github/releases?start=${start}&end=${end}`);
    };

    projectsFactory.github.getContributors = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/github/contributors`);
    };

    projectsFactory.github.getStatistics = (projectId) => {
      return $http.get(`${urlBase}/${projectId}/github/stats`);
    };

    projectsFactory.drive.getFiles = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/drive/files?start=${start}&end=${end}`);
    };

    projectsFactory.drive.getChanges = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/drive/changes?start=${start}&end=${end}`);
    };

    projectsFactory.drive.getActivities = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/drive/activities?start=${start}&end=${end}`);
    };

    projectsFactory.tasks.getTasks = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/tasks?start=${start}&end=${end}`);
    };

    projectsFactory.tasks.getActivities = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/tasks/activities?start=${start}&end=${end}`);
    };

    projectsFactory.milestones.getMilestones = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/milestones?start=${start}&end=${end}`);
    };

    projectsFactory.milestones.getActivities = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/milestones/activities?start=${start}&end=${end}`);
    };

    projectsFactory.milestones.getTasksByMilestones = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/milestones/tasks?start=${start}&end=${end}`);
    };

    projectsFactory.cloud.getOverview = (projectId, start, end) => {
      return $http.get(`${urlBase}/${projectId}/cloud/overview?start=${start}&end=${end}`);
    };

    return projectsFactory;
  }
})();
