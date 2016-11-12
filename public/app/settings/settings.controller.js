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
    '$scope', '$alert', '$log', '$q', '_', 'moment', 'Admin', 'AuthToken', 'Settings'
  ];

  function settingsCtrl($scope, $alert, $log, $q, _, moment, Admin, AuthToken, Settings) {
    const vm = this;
    const parent = $scope.$parent;
    const promptAlert = (title, content, type) => {
      $alert({
        title,
        content,
        type,
        placement: 'top-right',
        show: true,
        dismissable: true,
        duration: 2,
        animation: 'am-fade-and-slide-top'
      });
    };

    vm.createAccount = () => {
      Admin.createAdmin(vm.newAccount);
      vm.newAccount = {
        name: '',
        username: '',
        password: '',
        role: ''
      };
    };

    vm.sortableOptions = {
      placeholder: '<div class="sortable-placeholder col-md-3"><div></div></div>',
      forcePlaceholderSize: true
    };

    vm.updateAccount = () => {
      const payload = _.omitBy(vm.account, i => !i);
      Admin.updateAdmin(payload)
        .then((response) => {
          const data = response.data;
          AuthToken.saveToken(data.token, true);
          Settings.saveSettings(data.settings, true);
          parent.updateUserDisplay();
          promptAlert('Success!', 'Your account have been updated.', 'success');
        });
    };

    vm.addRange = function () {
      vm.ranges.push([(vm.ranges.length + 1), vm.description, vm.fromDate, vm.untilDate]);
      vm.description = vm.fromDate = vm.untilDate = '';
    };

    vm.removeRange = (index) => {
      _.pullAt(vm.ranges, index);
    };

    vm.updateRanges = () => {
      parent.settings.ranges = _.map(vm.ranges, (range, index) => {
        range[0] = index + 1;
        return range;
      });
      Admin.updateAdmin({ settings: parent.settings })
        .then(() => {
          Settings.saveSettings(parent.settings, true);
          parent.updateRangeDisplay();
          promptAlert('Success!', 'Your ranges have been saved.', 'success');
        });
    };

    vm.addMilestone = () => {
      vm.milestones.push([(vm.milestones.length + 1), vm.milestone]);
      vm.milestone = '';
    };

    vm.removeMilestone = (index) => {
      _.pullAt(vm.milestones, index);
    };

    vm.updateMilestones = () => {
      parent.settings.milestones = _.map(vm.milestones, (milestone, index) => {
        milestone[0] = index + 1;
        return milestone;
      });

      Admin.updateAdmin({ settings: parent.settings })
        .then(() => {
          Settings.saveSettings(parent.settings, true);
          promptAlert('Success!', 'Your tracked milestones have been saved.', 'success');
        });
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

      vm.ranges = parent.settings.ranges || [];
      vm.milestones = parent.settings.milestones || [];
    })();
  }
})();
