(() => {
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  tasksCtrl.$inject = ['$log', 'Tasks'];
  function tasksCtrl($log, Tasks) {
    const vm = this;

    Tasks.getOverview()
      .success((payload) => {
        vm.overview = payload;
      })
      .error($log.log);
  }
})();
