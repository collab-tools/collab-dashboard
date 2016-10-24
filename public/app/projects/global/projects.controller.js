/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace ProjectsCtrl
 */

(() => {
  angular
    .module('app')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl.$inject = ['$scope', '$log', '_', 'moment', 'Projects'];

  function projectsCtrl($scope, $log, _, moment, Projects) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      const start = parent.dateRange.selected.start;
      const end = parent.dateRange.selected.end;

      const processProjects = (projects) => {
        vm.projects = _.map(projects.data, (project) => {
          project.createdAt = moment(project.createdAt).format('Do MMM YY').toString();
          return project;
        });
        vm.projectCount = vm.projects.length;
        vm.usersMean = _.sumBy(vm.projects, project => project.users.length) / vm.projectCount;
        vm.requestCompleted = true;
      };

      return Projects
        .getProjects(start, end)
        .then(processProjects, $log.error);
    };

    // Initialize controller by setting subtitle and data
    (() => {
      vm.subtitle = 'Projects within Collab';
      return vm.requestData();
    })();
  }
})();
