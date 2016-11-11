/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace SettingsCtrl
 */

(() => {
  angular
    .module('app')
    .controller('settingsCtrl', settingsCtrl);

  settingsCtrl.$inject = [
    '$scope', '$log', '$q', '_', 'moment', 'Admin'
  ];

  function settingsCtrl($scope, $log, $q, _, moment, Admin) {
    const vm = this;
    const parent = $scope.$parent;

    vm.createAccount = () => {
      Admin.createAdmin(vm.account);
      vm.newAccount = {
        name: '',
        username: '',
        password: '',
        role: ''
      };
    };

    vm.updateAccount = () => {
      Admin.updateAdmin(vm.account);
    };

    vm.updateRanges = () => {

    };

    vm.updateTrack = () => {

    };

    // Initialize controller by setting subtitle and data
    (() => {
      vm.account = {
        name: parent.currentUser.name,
        username: parent.currentUser.username,
        password: '',
        role: parent.currentUser.role
      };

      vm.newAccount = {
        name: '',
        username: '',
        password: '',
        role: ''
      };

      vm.ranges = parent.currentUser.settings.ranges || [];

      vm.trackMilestones = parent.currentUser.settings.milestones || [];
    })();
  }
})();
