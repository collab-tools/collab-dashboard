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
    '$scope', 'moment', 'Milestones', 'Tasks', 'Drive', 'Github', 'Projects', 'Users',
  ];

  function dashboardCtrl($scope, moment, Milestones, Tasks, Drive, Github, Projects, Users) {
    const vm = this;
    const parent = $scope.$parent;
    vm.requestData = () => {
      const start = parent.dateRange.selected.start;
      const end = parent.dateRange.selected.end;

      // Retrieve number of milestones added
      Milestones
        .getMilestones(start, end)
        .then((response) => { vm.msCount = response.data.length; });

      // Retrieve number of tasks added
      Tasks
        .getTasks(start, end)
        .then((response) => { vm.taskCount = response.data.length; });

      // Retrieve number of github commits
      Github
        .getCommits(start, end)
        .then((response) => { vm.commitCount = response.data.length; });

      // Retrieve number of github releases
      Github
        .getReleases(start, end)
        .then((response) => { vm.releaseCount = response.data.length; });

      // Retrieve number of new files created
      Drive
        .getFiles(start, end)
        .then((response) => { vm.fileCount = response.data.length; });

      // Retrieve number of file changes
      Drive
        .getChanges(start, end)
        .then((response) => { vm.changeCount = response.data.length; });

      // Retrieve number of new projects
      Projects
        .getProjects(start, end)
        .then((response) => { vm.projectCount = response.data.length; });

      // Retrieve number of users that signed up during date range
      Users
        .getUsers(start, end)
        .then((response) => { vm.userCount = response.data.length; });

      // Retrieve number of total registered accounts
      Users
        .getUsers(0, moment().valueOf())
        .then((response) => { vm.totalCount = response.data.length; });

      // Retrieve unique users and retention rate (Google Analaytics)
      // Retrieve feature popularity (Google Analytics)
      // Retrieve site uptime
      // Retrieve average API load
    };

    // Initialize controller by setting subtitle and data
    (() => {
      vm.subtitle = 'Collab In A Glance';
      vm.requestData();
    })();


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
      [10, 4]
    ];

  }
})();
