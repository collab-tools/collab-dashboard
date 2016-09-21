/**
 * Controller must populate all the information required by the global tasks interface.
 * Refer to documentation for specific requirements.
 * @namespace TasksCtrl
 */
(() => {
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  tasksCtrl.$inject = ['$scope', '$log', '_', 'Tasks'];

  function tasksCtrl($scope, $log, _, Tasks) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Collab Statistics on Tasks Usage';

    const processActivities = () => {
      // Count Tasks Created, Pending and Completed
      _.forEach(vm.activities, (activity) => {
        $log.log(activity);
      });
    };

    Tasks
      .getOverview(parent.dateRange.selected.days)
      .then((response) => {
        vm.activities = response.activities;
        vm.activityCount = response.count;
      }, $log.error)
      .then(processActivities);


    // TODO: To be replaced with dynamic data
    vm.p_b_6 = [
      [1, 20],
      [2, 40],
      [3, 15],
      [4, 53],
      [5, 63],
      [6, 12],
      [7, 42]
    ];
    vm.p_b_7 = [
      [1, 24],
      [2, 44],
      [3, 17],
      [4, 51],
      [5, 62],
      [6, 15],
      [7, 51]
    ];
    vm.p_p_6 = [{ data: 35, label: 'Opened' }, { data: 15, label: 'Pending' }, {
      data: 50,
      label: 'Completed'
    }];
  }
})();
