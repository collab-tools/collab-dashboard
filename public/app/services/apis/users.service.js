/**
 * Service Factory that creates object that represent HTTP services
 * for /api/users Resources.
 * @namespace UsersFactory
 */

(() => {
  angular
    .module('app')
    .factory('Users', usersFactory);

  usersFactory.$inject = ['$http'];

  function usersFactory($http) {
    const urlBase = '/api/users';
    const usersFactory = {
      github: {},
      drive: {},
      cloud: {},
      milestones: {},
      tasks: {},
    };

    usersFactory.getUsers = (start, end) => {
      return $http.get(`${urlBase}?start=${start}&end=${end}`);
    };

    usersFactory.getUser = (userId) => {
      return $http.get(`${urlBase}/${userId}`);
    };

    usersFactory.getUserProjects = (userId) => {
      return $http.get(`${urlBase}/${userId}/projects`);
    };

    usersFactory.github.getUserRepos = (userId) => {
      return $http.get(`${urlBase}/${userId}/github/repos`);
    };

    usersFactory.github.getUserCommits = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/github/commits?start=${start}&end=${end}`);
    };

    usersFactory.github.getUserReleases = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/github/releases/count?start=${start}&end=${end}`);
    };

    usersFactory.github.getProjectRepo = (userId, projectId) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/repo`);
    };

    usersFactory.github.getProjectCommits = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/commits?start=${start}&end=${end}`);
    };

    usersFactory.github.getProjectReleases = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/releases?start=${start}&end=${end}`);
    };

    usersFactory.drive.getUserFiles = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/drive/files?start=${start}&end=${end}`);
    };

    usersFactory.drive.getUserChanges = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/drive/changes?start=${start}&end=${end}`);
    };

    usersFactory.drive.getUserActivities = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/drive/activities?start=${start}&end=${end}`);
    };

    usersFactory.drive.getProjectFiles = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/files?start=${start}&end=${end}`);
    };

    usersFactory.drive.getProjectChanges = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/changes?start=${start}&end=${end}`);
    };

    usersFactory.drive.getProjectActivities = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/activities?start=${start}&end=${end}`);
    };

    usersFactory.tasks.getUserTasks = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/tasks?start=${start}&end=${end}`);
    };

    usersFactory.tasks.getUserActivities = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/tasks/activities?start=${start}&end=${end}`);
    };

    usersFactory.tasks.getProjectTasks = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/tasks?start=${start}&end=${end}`);
    };

    usersFactory.tasks.getProjectActivities = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/tasks/activities?start=${start}&end=${end}`);
    };

    usersFactory.milestones.getUserMilestones = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/milestones?start=${start}&end=${end}`);
    };

    usersFactory.milestones.getAssignedUserMilestones = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/milestones/assigned?start=${start}&end=${end}`);
    };

    usersFactory.milestones.getTasksByMilestones = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/milestones/tasks?start=${start}&end=${end}`);
    };

    usersFactory.milestones.getTasksByProjectMilestones = (userId, projectId, start, end) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/milestones/tasks?start=${start}&end=${end}`);
    };

    usersFactory.cloud.getOverview = (userId, start, end) => {
      return $http.get(`${urlBase}/${userId}/cloud/overview?start=${start}&end=${end}`);
    };

    return usersFactory;
  }
})();
