/**
 * Controller must populate all the information required by the global tasks interface.
 * Refer to documentation for specific requirements.
 * @namespace TasksCtrl
 */

(() => {
  angular
    .module('app')
    .controller('tasksCtrl', tasksCtrl);

  tasksCtrl.$inject = ['$scope', '$log', '$q', '_', 'moment', 'Tasks', 'Users'];

  function tasksCtrl($scope, $log, $q, _, moment, Tasks, Users) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const processResponse = (response) => {
        const tasks = response[0].data;
        const activities = response[1].data;
        const participating = response[2].data;
        const users = response[3].data;

        // convert array of tasks into map
        const tasksMap = _.keyBy(tasks, 'id');

        // calculate task activities breakdown
        const createdTasks = _.filter(activities, { activity: 'C' });
        const createdTasksCount = createdTasks.length;
        const doneTasks = _.filter(activities, { activity: 'D' });
        const doneTasksCount = doneTasks.length;

        // calculate time to complete each tasks, mean time and deviation
        const doneTasksDuration = _.map(doneTasks, (activity) => {
          const completedOn = tasksMap[activity.taskId].completedOn;
          const createdAt = tasksMap[activity.taskId].createdAt;
          return moment(completedOn).diff(createdAt, 'hours', true);
        });
        const doneTasksDistribution = _
          .chain(doneTasksDuration)
          .groupBy(duration => duration.toFixed(2))
          .mapValues(v => v.length)
          .toPairs()
          .sortBy(t => t[0])
          .value();
        const doneTasksMax = _.max(doneTasksDuration);
        const doneTasksMin = _.min(doneTasksDuration);
        const doneTasksMean = _.sum(doneTasksDuration) / doneTasksCount;
        const doneTasksDeviation = _.reduce(doneTasksDuration, (sum, duration) => {
          return sum + Math.pow(duration - doneTasksMean, 2);
        }, 0) / doneTasksCount;

        // calculate number of tasks that are still pending
        const pendingTasks = _.filter(tasks, { completedOn: null });
        const pendingTasksCount = pendingTasks.length;

        // build tasks modal for view usages
        vm.tasks = {
          created: createdTasks,
          createdCount: createdTasksCount,
          done: doneTasks,
          doneCount: doneTasksCount,
          doneDistribution: doneTasksDistribution,
          doneMax: doneTasksMax,
          doneMin: doneTasksMin,
          doneMean: doneTasksMean,
          doneDeviation: doneTasksDeviation,
          pending: pendingTasks,
          pendingCount: pendingTasksCount
        };

        // build activities modal for view usages
        const activitiesCount = activities.length;
        const activitiesDistribution = [
          { label: 'Created', data: createdTasksCount },
          { label: 'Done', data: doneTasksCount }
        ];
        vm.activities = {
          data: activities,
          count: activitiesCount,
          distribution: activitiesDistribution
        };

        // calculate utilization rate
        const participatingCount = participating.length;
        const usersCount = users.length;
        const utilizationRate = _.round(participatingCount / usersCount, 1);

        // build participation and users modal for view usages
        vm.participation = {
          data: participating,
          count: participatingCount,
          utilization: utilizationRate
        };

        vm.users = {
          data: users,
          count: usersCount
        };
      };

      $q
        .all([
          Tasks.getTasks(0, vm.range.end),
          Tasks.getActivities(vm.range.start, vm.range.end),
          Tasks.getParticipatingUsers(vm.range.start, vm.range.end),
          Users.getUsers(0, vm.range.end)
        ])
        .then(processResponse, $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on Tasks Usage';
      vm.requestData();
    })();
  }
})();
