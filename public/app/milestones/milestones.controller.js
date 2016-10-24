/**
 * Controller must populate all the information required by the global milestones interface.
 * Refer to documentation for specific requirements.
 * @namespace MilestonesCtrl
 */

(() => {
  angular
    .module('app')
    .controller('milestonesCtrl', milestonesCtrl);

  milestonesCtrl.$inject = ['$scope', '$log', '$q', '_', 'moment', 'Milestones'];

  function milestonesCtrl($scope, $log, $q, _, moment, Milestones) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const processResponse = (response) => {
        const milestones = response[0].data;
        const elapsedMilestones = response[1].data;
        const activities = response[2].data;
        const milestoneTasks = response[3].data;

        // calculate the number of milestones completed and time taken to complete
        const milestonesCount = milestones.length;
        const elapsedMilestonesCount = elapsedMilestones.length;
        const completedMilestones = _.filter(elapsedMilestones, (milestone) => {
          return _.every(milestone.tasks, task => task.completedOn);
        });
        const completedMilestonesCount = completedMilestones.length;
        const completedMilestonesTimes = _.map(completedMilestones, (milestone) => {
          return moment(milestone.deadline).diff(moment(milestone.createdAt), 'hours', true);
        });
        const completedMilestonesMax = _.max(completedMilestonesTimes);
        const completedMilestonesMin = _.min(completedMilestonesTimes);
        const completedMilestonesMean = _.sum(completedMilestonesTimes) / completedMilestonesCount;
        const completedMilestonesDeviation = _.reduce(completedMilestonesTimes, (sum, time) => {
          return sum + Math.pow(time - completedMilestonesMean, 2);
        }, 0) / completedMilestonesCount;

        // calculate the number of missed milestones
        const milestonesMissed = _.filter(elapsedMilestones, (milestone) => {
          return _.some(milestone.tasks, task => !task.completedOn);
        });
        const milestonesMissedCount = milestonesMissed.length;
        const completionRate = completedMilestonesCount / elapsedMilestonesCount;

        // compute tracked milestones and comparisons


        // build milestones modal for view usages
        vm.milestones = {
          data: milestones,
          count: milestonesCount,
          elapsed: elapsedMilestones,
          elapsedCount: elapsedMilestonesCount,
          completed: completedMilestones,
          completedMax: completedMilestonesMax,
          completedMin: completedMilestonesMin,
          completedCount: completedMilestonesCount,
          completedMean: completedMilestonesMean,
          completedDeviation: completedMilestonesDeviation,
          missed: milestonesMissed,
          missedCount: milestonesMissedCount,
          rate: completionRate
        };

        // compute number of milestones created
        const activitiesCount = activities.length;
        const activitesCreated = _.filter(activities, { activity: 'C' });
        const activitesCreatedCount = activitesCreated.length;

        // build activites modal for view usages
        vm.activities = {
          data: activities,
          count: activitiesCount,
          created: activitesCreated,
          createdCount: activitesCreatedCount
        };

        // compute distribution of tasks per milestone and
        const milestoneTasksCount = milestoneTasks.length;
        const nullRemoved = _.omit(milestoneTasks, 'null');
        const tasksDistribution = _
          .chain(nullRemoved)
          .mapValues(tasks => tasks.length)
          .toPairs()
          .groupBy(pair => pair[1])
          .mapValues(milestones => milestones.length)
          .toPairs()
          .map((pair) => {
            return { label: pair[0], data: pair[1] };
          })
          .value();
        console.log(tasksDistribution);
        // build milestoneTasks modal for view usages
        vm.milestoneTasks = {
          data: milestoneTasks,
          count: milestoneTasksCount,
          distribution: tasksDistribution
        };
      };

      $q
        .all([
          Milestones.getMilestones(false, vm.range.start, vm.range.end),
          Milestones.getMilestones(true, vm.range.start, vm.range.end),
          Milestones.getActivities(vm.range.start, vm.range.end),
          Milestones.getTasksByMilestones(vm.range.start, vm.range.end)
        ])
        .then(processResponse, $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on Milestones Usage';
      vm.requestData();
    })();
  }
})();
