/**
 * Service Factory that creates object that represent HTTP services
 * for /api/global/tasks Resources.
 * @namespace TasksFactory
 */

(() => {
  angular
    .module('app')
    .factory('Tasks', tasksFactory);

  tasksFactory.$inject = ['$http'];

  function tasksFactory($http) {
    const urlBase = '/api/global/tasks';
    const tasksFactory = {};

    tasksFactory.getTasks = (range) => {
      return $http.get(`${urlBase}?range=${range}`);
    };

    tasksFactory.getTask = (taskId) => {
      return $http.get(`${urlBase}/${taskId}`);
    };

    tasksFactory.getActivities = (range) => {
      return $http.get(`${urlBase}/activities?range=${range}`);
    };

    tasksFactory.getTaskActivities = (taskId, range) => {
      return $http.get(`${urlBase}/${taskId}/activities?range=${range}`);
    };

    tasksFactory.getParticipatingUsers = (range) => {
      return $http.get(`${urlBase}/users?range=${range}`);
    };

    return tasksFactory;
  }
})();
