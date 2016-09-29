/**
 * Controller must populate all the information required by the global drive interface.
 * Refer to documentation for specific requirements.
 * @namespace DriveCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('driveCtrl', driveCtrl);

  driveCtrl.$inject = ['$scope', '$log', '_', 'Drive'];

  function driveCtrl($scope, $log, _, Drive) {
    const vm = this;
    const parent = $scope.$parent;

    vm.subtitle = 'Collab Statistics on Google Drive Usage';

    const processResponse = (response) => {
      /* process revisions which includes count, revisions over time, file type shared,
      number of active teams, deviations */
      vm.revisions = response.data.revisions;
    };

    Drive
      .getOverview(parent.dateRange.selected.days)
      .then(processResponse, $log.error);

    // TODO: To be replaced with dynamic data
    vm.p_p_5 = [{ data: 15, label: '.xlsx' }, { data: 65, label: '.docx' }, {
      data: 20,
      label: '.pdf'
    }];
    vm.p_l_3 = [
      [1, 2],
      [2, 1.6],
      [3, 2.4],
      [4, 2.1],
      [5, 1.7],
      [6, 1.5],
      [7, 1.7]
    ];
  }
})();
