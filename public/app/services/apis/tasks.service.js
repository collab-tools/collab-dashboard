(() => {
  angular
    .module('app')
    .factory('Tasks', ($http) => {
      const urlBase = '/api/global/tasks';
      const tasksFactory = {};

      tasksFactory.getOverview = (range) => {
        return $http.get(`${urlBase}/overview?range=${range}`);
      };

      tasksFactory.getMilestone = (taskId) => {
        return $http.get(`${urlBase}/tasks/${taskId}`);
      };

      return tasksFactory;
    });
})();
