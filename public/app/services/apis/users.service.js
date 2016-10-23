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

    usersFactory.getUsers = (range) => {
      return $http.get(`${urlBase}?range=${range}`);
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

    usersFactory.github.getUserCommits = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/github/commits?range=${range}`);
    };

    usersFactory.github.getUserReleases = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/github/releases/count?range=${range}`);
    };

    usersFactory.github.getProjectRepo = (userId, projectId) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/repo`);
    };

    usersFactory.github.getProjectCommits = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/commits?range=${range}`);
    };

    usersFactory.github.getProjectReleases = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/github/releases?range=${range}`);
    };

    usersFactory.drive.getUserFiles = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/drive/files?range=${range}`);
    };

    usersFactory.drive.getUserChanges = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/drive/changes?range=${range}`);
    };

    usersFactory.drive.getUserActivities = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/drive/activities?range=${range}`);
    };

    usersFactory.drive.getProjectFiles = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/files?range=${range}`);
    };

    usersFactory.drive.getProjectChanges = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/changes?range=${range}`);
    };

    usersFactory.drive.getProjectActivities = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/drive/activities?range=${range}`);
    };

    usersFactory.tasks.getUserTasks = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/tasks?range=${range}`);
    };

    usersFactory.tasks.getUserActivities = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/tasks/activities?range=${range}`);
    };

    usersFactory.tasks.getProjectTasks = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/tasks?range=${range}`);
    };

    usersFactory.tasks.getProjectActivities = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/tasks/activities?range=${range}`);
    };

    usersFactory.milestones.getUserMilestones = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/milestones?range=${range}`);
    };

    usersFactory.milestones.getAssignedUserMilestones = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/milestones/assigned?range=${range}`);
    };

    usersFactory.milestones.getTasksByMilestones = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/milestones/tasks?range=${range}`);
    };

    usersFactory.milestones.getTasksByProjectMilestones = (userId, projectId, range) => {
      return $http.get(`${urlBase}/${userId}/project/${projectId}/milestones/tasks?range=${range}`);
    };

    usersFactory.cloud.getOverview = (userId, range) => {
      return $http.get(`${urlBase}/${userId}/cloud/overview?range=${range}`);
    };

    return usersFactory;
  }
})();
