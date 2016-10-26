/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace UsersCtrl
 */

(() => {
  angular
    .module('app')
    .controller('usersCtrl', usersCtrl);

  usersCtrl.$inject = [
    '$scope', '$log', '$q', '_', 'moment', 'Milestones', 'Tasks', 'Drive', 'Github', 'Users'
  ];

  function usersCtrl($scope, $log, $q, _, moment, Milestones, Tasks, Drive, Github, Users) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const stripHeaders = response => _.map(response, 'data');
      const processResponse = (newUsers, users, milestonesPartial, tasksPartial, githubPartial, drivePartial) => {
        // format date of user createdAt to human readable format
        newUsers = _.map(newUsers, (user) => {
          user.createdAt = moment(user.createdAt).format('Do MMM YY').toString();
          return user;
        });
        const newUsersCount = newUsers.length;

        // calculate the number of active users
        const usersCount = users.length;
        const milestonesUsers = _.intersectionWith(users, milestonesPartial,
          (left, right) => left.id === right.userId);
        const tasksUsers = _.intersectionWith(users, tasksPartial,
          (left, right) => left.id === right.userId);
        const githubUsers = _.intersectionBy(users, githubPartial, 'githubLogin');
        const driveUsers = _.intersectionBy(users, drivePartial, 'email');
        const activeUsers = _.unionBy(milestonesUsers, tasksUsers, githubUsers, driveUsers, 'id');
        const activeUsersCount = activeUsers.length;

        // build user modal for view usages
        vm.users = {
          data: users,
          count: usersCount,
          new: newUsers,
          newCount: newUsersCount,
          activeCount: activeUsersCount
        };
      };

      $q
        .all([
          Users.getUsers(vm.range.start, vm.range.end),
          Users.getUsers(0, vm.range.end),
          Milestones.getParticipatingUsers(vm.range.start, vm.range.end),
          Tasks.getParticipatingUsers(vm.range.start, vm.range.end),
          Github.getParticipatingUsers(vm.range.start, vm.range.end),
          Drive.getParticipatingUsers(vm.range.start, vm.range.end)
        ])
        .then(stripHeaders, $log.error)
        .then(_.spread(processResponse), $log.error);
    };

    // Initialize controller by setting subtitle and requesting data
    (() => {
      vm.subtitle = 'Users of Collab';
      vm.requestData();
    })();
  }
})();
