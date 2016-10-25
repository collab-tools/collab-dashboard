/**
 * Controller must populate all the information required by the global users interface.
 * Refer to documentation for specific requirements.
 * @namespace ProjectsCtrl
 */

(() => {
  angular
    .module('app')
    .controller('projectsCtrl', projectsCtrl);

  projectsCtrl.$inject = [
    '$scope', '$log', '$q', '_', 'moment', 'Milestones', 'Tasks', 'Drive', 'Github', 'Projects'
  ];

  function projectsCtrl($scope, $log, $q, _, moment,
    Milestones, Tasks, Drive, Github, Projects) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const stripHeaders = response => _.map(response, 'data');
      const processResponse = (projects, newProjects, milestonesPartial,
        tasksPartial, githubPartial, drivePartial) => {
        const projectsCount = projects.length;
        newProjects = _.map(newProjects, (project) => {
          project.createdAt = moment(project.createdAt).format('Do MMM YY').toString();
          return project;
        });
        const newProjectsCount = newProjects.length;
        const meanProjectSize = _
          .sumBy(newProjects, project => project.users.length) / newProjectsCount;

        // calculate the number and percentage of active projects
        const activeProjects = _.unionBy(milestonesPartial, tasksPartial, githubPartial, drivePartial, 'projectId');
        const activeProjectsCount = activeProjects.length;
        // build projects modal for view usages
        vm.projects = {
          data: projects,
          count: projectsCount,
          new: newProjects,
          newCount: newProjectsCount,
          meanSize: meanProjectSize,
          activeCount: activeProjectsCount
        };
      };

      $q
        .all([
          Projects.getProjects(0, vm.range.end),
          Projects.getProjects(vm.range.start, vm.range.end),
          Milestones.getParticipatingProjects(vm.range.start, vm.range.end),
          Tasks.getParticipatingProjects(vm.range.start, vm.range.end),
          Github.getParticipatingProjects(vm.range.start, vm.range.end),
          Drive.getParticipatingProjects(vm.range.start, vm.range.end)
        ])
        .then(stripHeaders, $log.error)
        .then(_.spread(processResponse), $log.error);
    };

    // Initialize controller by setting subtitle and data
    (() => {
      vm.subtitle = 'Projects of Collab';
      vm.requestData();
    })();
  }
})();
