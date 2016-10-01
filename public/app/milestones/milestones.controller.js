/**
 * Controller must populate all the information required by the global milestones interface.
 * Refer to documentation for specific requirements.
 * @namespace MilestonesCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('milestonesCtrl', milestonesCtrl);

  milestonesCtrl.$inject = ['$scope', '$log', '_', 'Milestones'];

  function milestonesCtrl($scope, $log, _, Milestones) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Collab Statistics on Milestones Usage';

    const processActivities = (response) => {
      vm.milestones = response.activities;
      vm.milestoneCount = response.count;

      // Count milestones created and completed
      vm.created = _.filter(vm.activities, { activity: 'C' });
      vm.createdCount = vm.created.length;
      vm.done = _.filter(vm.activities, { activity: 'D' });
      vm.doneCount = vm.done.length;
      vm.startCompleted = _.sortBy(_.intersectionBy(vm.created, vm.done, 'milestoneId'), 'milestoneId');
      vm.doneCompleted = _.intersectionBy(vm.done, vm.created, 'milestoneId');
      vm.completedCount = vm.startCompleted.length;

      // Calculate percentages of the milestones statuses
      vm.createdPercentile = (vm.createdCount - vm.startCompleted.length) / vm.created;
      vm.donePercentile = vm.doneCompleted / vm.created;

      if (vm.doneCompleted.length !== vm.startCompleted.length) $log.error('Something went wrong.');
      else {
        // Compute time difference for each milestone
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

    Milestones
      .getOverview(parent.dateRange.selected.days)
      .then(processActivities);

    // TODO: To be replaced with dynamic data
    vm.p_p_2 = [{ data: 75, label: 'Closed' }, { data: 25, label: 'Open' }];
    vm.p_b_1 = [
      [1, 0.7],
      [2, 1],
      [3, 1],
      [4, 0.9],
      [5, 1],
      [6, 1],
      [7, 0.5]
    ];
    vm.p_b_3 = [
      [1, 3],
      [2, 4],
      [3, 3],
      [4, 6],
      [5, 5],
      [6, 4],
      [7, 5],
      [8, 3]
    ];
  }
})();
