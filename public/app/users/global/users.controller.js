/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace UsersCtrl
 */

(() => {
  angular
    .module('app')
    .controller('usersCtrl', usersCtrl);

  usersCtrl.$inject = ['$scope', '$log', '_', 'moment', 'Users'];

  function usersCtrl($scope, $log, _, moment, Users) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      const start = parent.dateRange.selected.start;
      const end = parent.dateRange.selected.end;

      const processUsers = (users) => {
        vm.users = _.map(users.data, (user) => {
          user.createdAt = moment(user.createdAt).format('Do MMM YY').toString();
          return user;
        });
        vm.usersCount = vm.users.length;
        // Active Users to be retrieved from Google Analytics
        vm.requestCompleted = true;
      };

      return Users
        .getUsers(start, end)
        .then(processUsers, $log.error);
    };

    // Initialize controller by setting subtitle and requesting data
    (() => {
      vm.users = [];
      vm.subtitle = 'Users of Collab';
      return vm.requestData();
    })();
  }
})();
