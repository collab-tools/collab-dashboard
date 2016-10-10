/**
 * Controller must populate all the information required by a user's interface.
 * Refer to documentation for specific requirements.
 * @namespace UserOverviewCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('userOverviewCtrl', userOverviewCtrl);

  userOverviewCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '_', 'Users', 'Projects'];

  function userOverviewCtrl($scope, $stateParams, $log, $q, _, Users, Projects) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Statistics on Hooi Tong\'s Usage';

    const userId = $stateParams.userId;
    const projectId = $stateParams.projectId;

    const retrievalFunctions = [
      Users.projects.getProject(userId, projectId),
      Users.github.getCommits(userId, parent.dateRange.selected.days),
      Users.drive.getRevisions(userId, parent.dateRange.selected.days),
      Users.tasks.getTasks(userId, parent.dateRange.selected.days),
      Users.milestones.getMilestones(userId, parent.dateRange.selected.days)
    ];

    const processPayload = (project, commits, revisions, tasks, milestones) => {
      vm.project = project;
      vm.commits = commits;
      vm.revisions = revisions;
      vm.tasks = tasks;
      vm.milestones = milestones;

      // calculate mean compute time

      // commits deviation

      // mean commit time

      // lines added and removed

      // contributions (commits and LOC)

      // number of files contributed

      // mean revision time

      // number of revisions made

      // revisions deviation

      // task activities breakdown

      // task activities comparison

      // milestone activities breakdown

      // milestone activities comparison
    };

    $q
      .all(retrievalFunctions)
      .then(processPayload);
  }
})();
