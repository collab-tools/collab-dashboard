(() => {
  angular
    .module('app')
    .factory('Users', ($http) => {
      const urlBase = '/api/users';
      const usersFactory = {
        github: {},
        drive: {},
        cloud: {},
        milestones: {},
        tasks: {},
        projects: {}
      };

      usersFactory.getUser = (userId) => {
        return $http.get(`${urlBase}/${userId}`);
      };

      usersFactory.getUsers = (range) => {
        return $http.get(`${urlBase}?range=${range}`);
      };

      usersFactory.projects.getProject = (userId, projectId) => {
        return $http.get(`${urlBase}/${userId}/projects/${projectId}`);
      };

      usersFactory.projects.getProjects = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/projects?range=${range}`);
      };

      usersFactory.drive.getOverview = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/drive/overview?range=${range}`);
      };

      usersFactory.drive.getFiles = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/drive/files?range=${range}`);
      };

      usersFactory.drive.getFilesCount = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/drive/files/count?range=${range}`);
      };

      usersFactory.drive.getRevisions = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/drive/revisions?range=${range}`);
      };

      usersFactory.drive.getRevisionsCount = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/drive/revisions/count?range=${range}`);
      };

      usersFactory.github.getOverview = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/github/overview?range=${range}`);
      };

      usersFactory.github.getCommits = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/github/commits?range=${range}`);
      };

      usersFactory.github.getCommitsCount = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/github/commits/count?range=${range}`);
      };

      usersFactory.cloud.getOverview = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/cloud/overview?range=${range}`);
      };

      usersFactory.tasks.getOverview = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/tasks/overview?range=${range}`);
      };

      usersFactory.tasks.getTasks = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/tasks?range=${range}`);
      };

      usersFactory.milestones.getOverview = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/milestones/overview?range=${range}`);
      };

      usersFactory.milestones.getMilestones = (userId, range) => {
        return $http.get(`${urlBase}/${userId}/milestones?range=${range}`);
      };

      return usersFactory;
    });
})();
