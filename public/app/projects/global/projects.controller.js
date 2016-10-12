/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace ProjectsCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl.$inject = ['$scope', '$log', '_', 'Projects'];

  function projectsCtrl($scope, $log, _, Projects) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Projects within Collab';

    const processProjects = (projects) => {
      vm.projects = projects;
      vm.projectCount = vm.projects.length;
    };

    Projects
      .getProjects(parent.dateRange.selected.days)
      .then(processProjects, $log.error);
  }
})();
