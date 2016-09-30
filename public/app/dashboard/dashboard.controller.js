/**
 * Controller must populate all the information required by the dashboard interfaces.
 * Refer to documentation for specific requirements.
 * @namespace DashboardCtrl
 */
(() => {
  angular
    .module('app')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = ['$scope', 'Milestones', 'Tasks', 'Github', 'Users'];

  function dashboardCtrl($scope, Milestones, Tasks, Github, Users) {
    const vm = this;
    const parent = $scope.$parent;

    vm.subtitle = 'Collab In A Glance';

    // Retrieve number of milestones added
    Milestones
      .getCount(parent.dateRange.selected.days)
      .then((response) => { vm.msCount = response.data.count; });

    // Retrieve number of tasks added
    Tasks
      .getCount(parent.dateRange.selected.days)
      .then((response) => { vm.taskCount = response.data.count; });

    // Retrieve number of users and other statistics
    Users
      .getUsers(parent.dateRange.selected.days)
      .then((response) => { vm.newUsers = response.data.count; });

    // Retrieve feature popularity TODO: Google Analytics

    // Retrieve number of commits TODO: Google Analytics

    // TODO: To be replaced with dynamic data
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
