(() => {
  angular
    .module('app')
    .factory('Projects', ($http) => {
      const urlBase = '/api/projects';
      const projectsFactory = {
        github: {},
        drive: {},
        cloud: {},
        milestones: {},
        tasks: {}
      };

      projectsFactory.getProject = (projectId) => {
        return $http.get(`${urlBase}/${projectId}`);
      };

      projectsFactory.getProjects = (range) => {
        return $http.get(`${urlBase}?range=${range}`);
      };

      projectsFactory.drive.getOverview = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/drive/overview?range=${range}`);
      };

      projectsFactory.drive.getFiles = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/drive/files?range=${range}`);
      };

      projectsFactory.drive.getRevisions = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/drive/revisions?range=${range}`);
      };

      projectsFactory.github.getOverview = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/github/overview?range=${range}`);
      };

      projectsFactory.github.getCommits = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/github/commits?range=${range}`);
      };

      projectsFactory.cloud.getOverview = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/cloud/overview?range=${range}`);
      };

      projectsFactory.tasks.getOverview = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/tasks/overview?range=${range}`);
      };

      projectsFactory.tasks.getTasks = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/tasks?range=${range}`);
      };

      projectsFactory.milestones.getOverview = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/milestones/overview?range=${range}`);
      };

      projectsFactory.milestones.getMilestones = (projectId, range) => {
        return $http.get(`${urlBase}/${projectId}/milestones?range=${range}`);
      };

      return projectsFactory;
    });
})();
