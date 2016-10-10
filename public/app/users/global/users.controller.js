/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace UsersCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('usersCtrl', usersCtrl);

  usersCtrl.$inject = ['$scope', '$log', '_', 'Users'];

  function usersCtrl($scope, $log, _, Users) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Users using Collab';

    const processUsers = (users) => {
      vm.users = users;
      vm.usersCount = users.length;
    };

    Users
      .getUsers(parent.dateRange.selected.days)
      .then(processUsers, $log.error);
  }
})();
