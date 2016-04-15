(() => {
  'use strict';
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  function tasksCtrl($scope) {

  }

  function getTasksOverview($http) {
    return $http.get('/api/tasks/overview');
  }
})();
