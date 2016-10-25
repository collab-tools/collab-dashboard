/**
 * Controller must populate all the information required by the dashboard interfaces.
 * Refer to documentation for specific requirements.
 * @namespace DashboardCtrl
 */

(() => {
  angular
    .module('app')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = [
    '$scope', '$log', '$q', '_', 'moment', 'Milestones', 'Tasks', 'Drive', 'Github', 'Projects', 'Users'
  ];

  function dashboardCtrl($scope, $log, $q, _, moment,
    Milestones, Tasks, Drive, Github, Projects, Users) {
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
        const tasks = response[1].data;
        const commits = response[2].data;
        const releases = response[3].data;
        const files = response[4].data;
        const changes = response[5].data;
        const projects = response[6].data;
        const newUsers = response[7].data;
        const users = response[8].data;
        const milestonesUsersPartial = response[9].data;
        const tasksUsersPartial = response[10].data;
        const githubUsersPartial = response[11].data;
        const driveUsersPartial = response[12].data;

        // build individual modals for view usages
        vm.milestones = {
          data: milestones,
          count: milestones.length
        };

        vm.tasks = {
          data: tasks,
          count: tasks.length
        };

        vm.commits = {
          data: commits,
          count: commits.length
        };

        vm.releases = {
          data: releases,
          count: releases.length
        };

        vm.files = {
          data: files,
          count: files.length
        };

        vm.changes = {
          data: changes,
          count: changes.length
        };

        vm.projects = {
          data: projects,
          count: projects.length
        };

        vm.newUsers = {
          data: newUsers,
          count: newUsers.length
        };

        // calculate active users, inactive users and retention rate
        const usersCount = users.length;
        const milestonesUsers = _.intersectionWith(users, milestonesUsersPartial,
          (left, right) => left.id === right.userId);
        const milestonesUsersCount = milestonesUsers.length;
        const tasksUsers = _.intersectionWith(users, tasksUsersPartial,
          (left, right) => left.id === right.userId);
        const tasksUsersCount = tasksUsers.length;
        const githubUsers = _.intersectionBy(users, githubUsersPartial, 'githubLogin');
        const githubUsersCount = githubUsers.length;
        const driveUsers = _.intersectionBy(users, driveUsersPartial, 'email');
        const driveUsersCount = driveUsers.length;
        const activeUsers = _.unionBy(milestonesUsers, tasksUsers, githubUsers, driveUsers, 'id');
        const activeUsersCount = activeUsers.length;
        const inactiveUsersCount = usersCount - activeUsersCount;
        const retentionRate = activeUsersCount / usersCount;
        const usersDistribution = [
          [githubUsersCount, 0],
          [driveUsersCount, 1],
          [tasksUsersCount, 2],
          [milestonesUsersCount, 3]
        ];

        vm.users = {
          data: users,
          count: usersCount,
          activeCount: activeUsersCount,
          inactiveCount: inactiveUsersCount,
          milestones: milestonesUsers,
          milestonesCount: milestonesUsersCount,
          tasks: tasksUsers,
          tasksCount: tasksUsersCount,
          github: githubUsers,
          githubCount: githubUsersCount,
          drive: driveUsers,
          driveCount: driveUsersCount,
          distribution: usersDistribution,
          retention: retentionRate
        };
      };

      $q
        .all([
          Milestones.getMilestones(false, vm.range.start, vm.range.end),
          Tasks.getTasks(vm.range.start, vm.range.end),
          Github.getCommits(vm.range.start, vm.range.end),
          Github.getReleases(vm.range.start, vm.range.end),
          Drive.getFiles(vm.range.start, vm.range.end),
          Drive.getChanges(vm.range.start, vm.range.end),
          Projects.getProjects(vm.range.start, vm.range.end),
          Users.getUsers(vm.range.start, vm.range.end),
          Users.getUsers(0, vm.range.end),
          Milestones.getParticipatingUsers(vm.range.start, vm.range.end),
          Tasks.getParticipatingUsers(vm.range.start, vm.range.end),
          Github.getParticipatingUsers(vm.range.start, vm.range.end),
          Drive.getParticipatingUsers(vm.range.start, vm.range.end)
        ]).then(processResponse, $log.error);
    };

    // Initialize controller by setting subtitle and data
    (() => {
      vm.subtitle = 'Collab In A Glance';
      vm.requestData();
    })();

    // Sample Data to be Removed
    vm.p_p_1 = [{ data: 70, label: 'Free' }, { data: 30, label: 'Busy' }];
    vm.p_b_1 = [
      [1, 0.7],
      [2, 1],
      [3, 1],
      [4, 0.9],
      [5, 1],
      [6, 1],
      [7, 0.5]
    ];
    vm.p_b_2 = [
      [65, 0],
      [200, 1],
      [50, 2],
      [76, 3],
    ];
  }
})();
