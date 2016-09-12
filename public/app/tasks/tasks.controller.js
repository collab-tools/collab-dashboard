(() => {
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  function tasksCtrl() {
    const vm = this;
    
  }

  function getTasksOverview($http) {
    return $http.get('/api/tasks/overview');
  }
})();
