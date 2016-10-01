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
      vm.teamsCount = response.data.projectsCount;
      vm.activeTeams = _.uniqBy(vm.revisions, 'projectId');
      vm.activeTeamsCount = vm.activeTeams.length;
      vm.inactiveTeamsCount = vm.teamsCount - vm.activeTeamsCount;

      vm.revisionsCount = vm.revisions.length;
      vm.activeUsersCount = response.data.activeUsersCount;
      vm.usersCount = response.data.userCount;
      vm.utilizationRate = vm.activeUsersCount / vm.usersCount;

      vm.revisionsByDate = _.groupBy(vm.revisions, (revision) => {
        return moment(revision.date).startOf('day');
      });
      vm.revisionsByDate = _.mapValues(vm.revisionsByDate, (revisions) => {
        return revisions.length;
      });

      vm.meanRevisions = vm.revisionsCount / parent.dateRange.selected.days;
      vm.maxPair = _.maxBy(_.toPairs(vm.revisionsByDate), (dateCount) => { return dateCount[1]; });
      vm.minPair = _.minBy(_.toPairs(vm.revisionsByDate), (dateCount) => { return dateCount[1]; });
      vm.deviationRevisions = _.reduce(vm.revisionsByDate, (sum, count) => {
        return sum + Math.pow(count - vm.meanRevisions, 2);
      }) / parent.dateRange.selected.days;

      vm.files = response.data.files;
      vm.filesCount = vm.files.length;
      vm.filesByType = _.groupBy(vm.files, 'fileExtension');
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
