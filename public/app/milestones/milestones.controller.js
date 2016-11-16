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

    vm.changeComparison = () => {
      Milestones.getMilestones(true, vm.range.start, vm.range.end)
        .then((response) => {
          const elapsedMilestones = response.data;
          const completedMilestones = _.filter(elapsedMilestones, (milestone) => {
            return _.every(milestone.tasks, task => task.completedOn);
          });

          // filter only tracked milestones from content
          const trackedKeys = _.map(parent.settings.milestones, milestone => milestone[1]);
          const ticks = parent.settings.milestones;
          const trackedMap = _.chain(ticks).fromPairs().invert();
          const trackedAverage = _
            .chain(completedMilestones)
            .keyBy('content')
            .at(trackedKeys)
            .groupBy('content')
            .mapValues((tl) => {
              return _
                .chain(tl)
                .map(tl, (t) => {
                  return moment(t.deadline).diff(moment(t.createdAt), 'hours', true);
                })
                .sum()
                .value() / tl.length;
            })
            .toPairs()
            .mapKeys((value, key) => trackedMap[key])
            .value();

          vm.milestones.tracked.push({
            data: trackedAverage,
            bars: {
              show: true,
              barWidth: 0.25,
              lineWidth: 1,
              fillColor: { colors: [{ opacity: 0.8 }, { opacity: 1 }] },
              order: 2
            }
          });
        });
    };

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      vm.dateRange = _.clone(parent.dateRange);
      if (_.isEmpty(vm.dateRange.selected)) vm.dateRange.selected = vm.dateRange[0];

      const stripHeaders = response => _.map(response, 'data');
      const processResponse = (milestones, elapsedMilestones, activities, milestoneTasks) => {
        // calculate the number of milestones completed and time taken to complete
        const milestonesCount = milestones.length;
        const elapsedMilestonesCount = elapsedMilestones.length;
        const completedMilestones = _.filter(elapsedMilestones, (milestone) => {
          return _.every(milestone.tasks, task => task.completedOn);
        });
        const completedMilestonesCount = completedMilestones.length;
        const completedMilestonesDuration = _.map(completedMilestones, (milestone) => {
          return moment(milestone.deadline).diff(moment(milestone.createdAt), 'hours', true);
        });
        const completedMilestonesMax = _.max(completedMilestonesDuration);
        const completedMilestonesMin = _.min(completedMilestonesDuration);
        const completedMilestonesMean = _
          .sum(completedMilestonesDuration) / completedMilestonesCount;
        const completedMilestonesDeviation = _
          .reduce(completedMilestonesDuration, (sum, duration) => {
            return sum + Math.pow(duration - completedMilestonesMean, 2);
          }, 0) / completedMilestonesCount;

        // calculate the number of missed milestones
        const milestonesMissed = _.filter(elapsedMilestones, (milestone) => {
          return _.some(milestone.tasks, task => !task.completedOn);
        });
        const milestonesMissedCount = milestonesMissed.length;
        const completionRate = completedMilestonesCount / elapsedMilestonesCount;

        // compute tracked milestones and comparisons
        const trackedMilestones = [];

        // filter only tracked milestones from content
        const trackedKeys = _.map(parent.settings.milestones, milestone => milestone[1]);
        const ticks = parent.settings.milestones;
        const trackedMap = _.chain(ticks).fromPairs().invert();
        const trackedAverage = _
          .chain(completedMilestones)
          .keyBy('content')
          .at(trackedKeys)
          .groupBy('content')
          .omit('undefined')
          .mapValues((tl) => {
            return _
              .chain(tl)
              .map(t => moment(t.deadline).diff(moment(t.createdAt), 'hours', true))
              .sum()
              .value() / tl.length;
          })
          .toPairs()
          .map(point => [trackedMap[point[0]], point[1]])
          .value();

        trackedMilestones.push({
          data: trackedAverage,
          bars: {
            show: true,
            barWidth: 0.25,
            lineWidth: 1,
            fillColor: { colors: [{ opacity: 0.8 }, { opacity: 1 }] },
            order: 1
          }
        });

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
          rate: completionRate,
          tracked: trackedMilestones,
          ticks
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

        // build milestoneTasks modal for view usages
        vm.milestoneTasks = {
          data: milestoneTasks,
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
        .then(stripHeaders, $log.error)
        .then(_.spread(processResponse), $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on Milestones Usage';
      vm.requestData();
    })();
  }
})();
