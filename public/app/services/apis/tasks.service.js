(() => {
  angular
    .module('app')
    .factory('Tasks', tasksFactory);

  tasksFactory.$inject = ['$http'];

  function tasksFactory($http) {
    const urlBase = '/api/global/tasks';
    const tasksFactory = {};

    tasksFactory.getOverview = (range) => {
      return $http.get(`${urlBase}/overview?range=${range}`);
    };

    tasksFactory.getTasks = (range) => {
      return $http.get(`${urlBase}?range=${range}&count=0`);
    };

    tasksFactory.getCount = (range) => {
      return $http.get(`${urlBase}?range=${range}&count=1`);
    };

    tasksFactory.getTask = (taskId) => {
      return $http.get(`${urlBase}/${taskId}`);
    };

    return tasksFactory;
  }
})();
