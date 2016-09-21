/**
 * Controller must populate all the information required by the global tasks interface.
 * Refer to documentation for specific requirements.
 * @namespace TasksCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  tasksCtrl.$inject = ['$scope', '$log', '_', 'Tasks'];

  function tasksCtrl($scope, $log, _, Tasks) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Collab Statistics on Tasks Usage';

    const processActivities = (response) => {
      vm.activities = response.activities;
      vm.activityCount = response.count;

      // Count tasks created, pending, completed
      vm.created = _.filter(vm.activities, { activity: 'C' });
      vm.createdCount = vm.created.length;
      vm.done = _.filter(vm.activities, { activity: 'D' });
      vm.doneCount = vm.done.length;
      vm.startCompleted = _.sortBy(_.intersectionBy(vm.created, vm.done, 'taskId'), 'taskId');
      vm.doneCompleted = _.intersectionBy(vm.done, vm.created, 'taskId');
      vm.completedCount = vm.startCompleted.length;

      // Calculate percentages of the tasks statuses
      vm.createdPercentile = (vm.createdCount - vm.startCompleted.length) / vm.created;
      vm.donePercentile = vm.doneCompleted / vm.created;

      if (vm.doneCompleted.length !== vm.startCompleted.length) $log.error('Something went wrong.');
      else {
        // Compute time difference for each task
        vm.completionTimes = _.map(_.zip(vm.startCompleted, vm.doneCompleted), activityPair => {
          const startDate = moment(activityPair[0], 'YYYY-MM-DD HH:mm:ss');
          const endDate = moment(activityPair[1], 'YYYY-MM-DD HH:mm:ss');
          return endDate.diff(startDate, 'minutes');
        });

        // Calculate completion mean time as well as standard deviation
        // Naive implementation: Double Reduce following formula for mean and SD
        vm.meanCompletion = (_.reduce(vm.completionTimes, (sum, minutes) => {
          return sum + minutes;
        })) / vm.completionTimes.length;

        vm.deviationCompletion = (_.reduce(vm.completionTimes, (vsum, minutes) => {
          return vsum + Math.pow(minutes - vm.meanCompletion, 2);
        })) / vm.completionTimes.length;
      }
    };

    Tasks
      .getOverview(parent.dateRange.selected.days)
      .then(processActivities, $log.error);

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
