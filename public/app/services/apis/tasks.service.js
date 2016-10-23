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

    tasksFactory.getTasks = (start, end) => {
      return $http.get(`${urlBase}?start=${start}&end=${end}`);
    };

    tasksFactory.getTask = (taskId) => {
      return $http.get(`${urlBase}/${taskId}`);
    };

    tasksFactory.getActivities = (start, end) => {
      return $http.get(`${urlBase}/activities?start=${start}&end=${end}`);
    };

    tasksFactory.getTaskActivities = (taskId, start, end) => {
      return $http.get(`${urlBase}/${taskId}/activities?start=${start}&end=${end}`);
    };

    tasksFactory.getParticipatingUsers = (start, end) => {
      return $http.get(`${urlBase}/users?start=${start}&end=${end}`);
    };

    return tasksFactory;
  }
})();
