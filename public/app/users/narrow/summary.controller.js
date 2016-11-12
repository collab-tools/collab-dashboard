/**
 * Controller must populate all the information required by a user's interface.
 * Refer to documentation for specific requirements.
 * @namespace UserSummaryCtrl
 */

(() => {
  angular
    .module('app')
    .controller('userSummaryCtrl', userSummaryCtrl);

  userSummaryCtrl.$inject = [
    '$scope', '$state', '$stateParams', '$log', '$q', '_', 'moment', 'Users', 'Projects'
  ];

  function userSummaryCtrl($scope, $state, $stateParams, $log, $q, _, moment, Users, Projects) {
    const vm = this;
    const parent = $scope.$parent;
    const userId = $stateParams.userId;

    $scope.$on('$locationChangeStart', () => {
      parent.displayPicture = null;
    });

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const stripHeaders = response => _.map(response, 'data');
      const processResponse = (user, projects, commits, files, changes,
        tasks, tasksActivities, milestones, milestonesActivities) => {
        vm.user = {
          data: user,
          projects: { data: projects },
          commits: { data: commits },
          files: { data: files },
          changes: { data: changes },
          tasks: { data: tasks, activities: tasksActivities },
          milestones: { data: milestones, activities: milestonesActivities }
        };

        // configure titles and subtitles based on retrieved project
        $state.current.data = { title: `User: ${user.displayName}` };
        vm.subtitle = 'Projects Available:';
        parent.displayPicture = user.displayImage;
        vm.user.projects.data.selected = vm.user.projects.data[0];
      };

      const retrieveProjectsActivities = () => {
        const promises = [];
        _.forEach(vm.user.projects.data, (project) => {
          promises.push($q.all([
            Projects.github.getCommits(project.id, vm.range.start, vm.range.end),
            Projects.github.getContributors(project.id),
            Projects.github.getStatistics(project.id),
            Projects.drive.getFiles(project.id, vm.range.start, vm.range.end),
            Projects.drive.getChanges(project.id, vm.range.start, vm.range.end),
            Projects.tasks.getTasks(project.id, vm.range.start, vm.range.end),
            Projects.tasks.getActivities(project.id, vm.range.start, vm.range.end),
            Projects.milestones.getMilestones(false, project.id, vm.range.start, vm.range.end),
            Projects.milestones.getActivities(project.id, vm.range.start, vm.range.end)
          ]));
        });
        return $q.all(promises);
      };

      const processProjects = (projectsResponse) => {
        vm.projects = {};
        const processProject = (commits, files, contributors, stats, changes,
          tasks, tasksActivities, milestones, milestonesActivities, projectIndex) => {
          const projectId = vm.user.projects.data[projectIndex].id;

          const projectSpan = moment().diff(moment(vm.projects[projectId].createdAt), 'days');

          // build project modal
          vm.projects[projectId] = {
            commits: { data: commits },
            files: { data: files },
            changes: { data: changes },
            tasks: { data: tasks, activities: tasksActivities },
            milestones: { data: milestones, activities: milestonesActivities },
            span: projectSpan
          };


          // up abbv. as user project
          // build commits modal for a project
          const upCommits = _.filter(vm.user.commits.data, { projectId });
          const upCommitsCount = upCommits.length;

          const upCommitsByDate = _
            .chain(upCommits)
            .groupBy(commit => moment(commit.date).startOf('day').valueOf())
            .mapValues(commits => commits.length)
            .toPairs()
            .value();

          // calculate mean and standard deviation
          const meanUpCommits = upCommitsCount / projectSpan;
          const deviationUpCommits = _.reduce(commitsByDate, (sum, pair) => {
            return sum + Math.pow(pair[1] - meanCommits, 2);
          }, 0) / projectSpan;

          // compute number of lines added and removed
          const linesChanged = _.reduce(stats.codes, (sum, week) => {
            if (moment(week[0]).isSameOrAfter(vm.range.start, 'day')) {
              sum[0] += week[1];
              sum[1] += Math.abs(week[2]);
            }
            return sum;
          }, [0, 0]);

          vm.commits[projectId] = {
            data: upCommits,
            count: upCommitsCount,
            mean:,
            deviation:,
            contribution:,
          };

          // build commits modal for a project
          vm.files[projectId] = {

          };

          // build commits modal for a project
          vm.changes[projectId] = {

          };

          // build commits modal for a project
          vm.tasks[projectId] = {

          };

          // build commits modal for a project
          vm.milestones[projectId] = {

          };
        };
        _.forEach(projectsResponse, (projectResponse, index) => {
          projectResponse = _.map(projectResponse, 'data');
          projectResponse.push(index);
          _.spread(processProject)(projectResponse);
        });
      };

      $q
        .all([
          Users.getUser(userId),
          Users.getUserProjects(userId),
          Users.github.getUserCommits(userId, vm.range.start, vm.range.end),
          Users.drive.getUserFiles(userId, vm.range.start, vm.range.end),
          Users.drive.getUserChanges(userId, vm.range.start, vm.range.end),
          Users.tasks.getUserTasks(userId, vm.range.start, vm.range.end),
          Users.tasks.getUserActivities(userId, vm.range.start, vm.range.end),
          Users.milestones.getUserMilestones(userId, vm.range.start, vm.range.end),
          Users.milestones.getUserActivities(userId, vm.range.start, vm.range.end)
        ])
        .then(stripHeaders, $log.error)
        .then(_.spread(processResponse), $log.error)
        .then(retrieveProjectsActivities, $log.error)
        .then(processProjects, $log.error);
    };

    // Initialize controller by setting subtitle and requesting data
    (() => {
      vm.subtitle = 'Project';
      vm.displayProjects = true;
      vm.defaultProject = $stateParams.projectId;
      vm.requestData();
    })();
  }
})();
