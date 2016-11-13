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
            Projects.getProject(project.id),
            Projects.github.getCommits(project.id, vm.range.start, vm.range.end),
            Projects.github.getContributors(project.id),
            Projects.github.getStatistics(project.id),
            Projects.drive.getActivities(project.id, vm.range.start, vm.range.end),
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
        vm.commits = {};
        vm.files = {};
        vm.changes = {};
        vm.milestones = {};
        vm.tasks = {};

        const processProject = (project, commits, contributors, stats, driveActivities, files,
          changes, tasks, tasksActivities, milestones, milestonesActivities, projectIndex) => {
          const projectId = vm.user.projects.data[projectIndex].id;
          const projectSpan = moment().diff(moment(vm.projects[projectId].createdAt), 'days');
          const projectUsers = project.users;
          const projectUsersCount = projectUsers.length;

          // build project modal
          vm.projects[projectId] = {
            data: project,
            users: projectUsers,
            usersCount: projectUsersCount,
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
          const deviationUpCommits = _.reduce(upCommitsByDate, (sum, pair) => {
            return sum + Math.pow(pair[1] - meanUpCommits, 2);
          }, 0) / projectSpan;

          // compute number of lines added and removed
          const linesChanged = _
            .chain(contributors)
            .find(c => c.author.login === vm.user.data.githubLogin)
            .get('weeks')
            .reduce((sum, week) => {
              if (moment(week.w).isSameOrAfter(vm.range.start, 'day')) {
                sum[0] += week.a;
                sum[1] += Math.abs(week.d);
              }
              return sum;
            }, [0, 0]);

          const projectLinesChanged = _.reduce(stats.codes, (sum, week) => {
            if (moment(week[0]).isSameOrAfter(vm.range.start, 'day')) {
              sum[0] += week[1];
              sum[1] += Math.abs(week[2]);
            }
            return sum;
          }, [0, 0]);

          // compute commits and LOC contribution
          const contributionCommits = upCommitsCount / commits.length;
          const contributionLOC = _.sum(linesChanged) / _.sum(projectLinesChanged);

          vm.commits[projectId] = {
            data: upCommits,
            count: upCommitsCount,
            mean: meanUpCommits,
            deviation: deviationUpCommits,
            lines: linesChanged,
            contribCommits: contributionCommits,
            contribLines: contributionLOC
          };

          // number of files contributed to
          const upFiles = _.filter(vm.user.files.data, { projectId });
          const upFilesCount = upFiles.length;
          const contributedFiles = _.uniqBy(upFiles, 'fileUUID');
          const contributedFilesCount = contributedFiles.length;

          // build files modal for a project
          vm.files[projectId] = {
            data: upFiles,
            count: upFilesCount,
            contributed: contributedFiles,
            contributedCount: contributedFilesCount
          };

          // breakdown of changes
          const upChanges = _.filter(vm.user.files.data, { projectId });
          const upChangesCount = upChanges.length;
          const upChangesByDate = _
            .chain(upChanges)
            .groupBy(change => moment(change.date).startOf('day').valueOf())
            .mapValues(changes => changes.length)
            .toPairs()
            .value();

          const meanUpChanges = upChangesCount / projectSpan;
          const deviationUpChanges = _.reduce(upChangesByDate, (sum, pair) => {
            return sum + Math.pow(pair[1] - meanUpChanges, 2);
          }, 0) / projectSpan;

          const contributionChanges = upChangesCount / changes.length;

          // build changes modal for a project
          vm.changes[projectId] = {
            data: upChanges,
            count: upChangesCount,
            mean: meanUpChanges,
            deviation: deviationUpChanges,
            contribChanges: contributionChanges
          };

          // compute task breakdown and contribution
          const upTasks = _.filter(vm.user.tasks.data, { projectId });
          const upTasksCount = upTasks.length;
          const upTasksActivities = _
            .chain(vm.user.tasks.activities)
            .filter({ projectId })
            .map((activity) => {
              activity.task = _.find(tasks, { id: activity.taskId });
              return activity;
            });
          const upTasksActivitiesCount = upTasksActivities.length;

          const createdUpTasks = _.filter(upTasksActivities, { activity: 'C' });
          const createdUpTasksCount = createdUpTasks.length;
          const doneUpTasks = _.filter(upTasksActivities, { activity: 'D' });
          const doneUpTasksCount = doneUpTasks.length;
          const pendingUpTasks = _.filter(upTasks, { completedOn: null });
          const pendingUpTasksCount = pendingUpTasks.length;
          const assignedUpTasks = _.reject(upTasks, { assigneeId: null });
          const assignedUpTasksCount = assignedUpTasks.length;
          const completedUpTasks = _.reject(upTasks, { completedOn: null });
          const completedUpTasksCount = completedUpTasks.length;
          const completionRate = completedUpTasksCount / upTasks;
          const contributionTasks = upTasksCount / tasks.length;

          // build tasks modal for a project
          vm.tasks[projectId] = {
            data: upTasks,
            count: upTasksCount,
            activities: {
              data: upTasksActivities,
              count: upTasksActivitiesCount,
            },
            created: createdUpTasks,
            createdCount: createdUpTasksCount,
            done: doneUpTasks,
            doneCount: doneUpTasksCount,
            pending: pendingUpTasks,
            pendingCount: pendingUpTasksCount,
            assigned: assignedUpTasks,
            assignedCount: assignedUpTasksCount,
            rate: completionRate,
            contribTasks: contributionTasks
          };

          // compute number of project milestones
          const milestonesCount = milestones.length;

          // compute milestones participated
          const participatedMilestones = _.filter(milestones, (milestone) => {
            return _.find(milestone.tasks, { assigneeId: vm.user.data.id });
          });
          const participatedMilestonesCount = participatedMilestones.length;

          // compute milestones not participated
          const notParticipatedMilestones = _.filter(milestones, (milestone) => {
            return _.find(milestone.tasks, o => o.assigneeId !== vm.user.data.id);
          });
          const notParticipatedMilestonesCount = notParticipatedMilestones.length;

          // compute milestones participation rate
          const participationRate = participatedMilestonesCount / milestonesCount;

          // compute mean tasks assigned per milestone
          const meanAssignedTasks = assignedUpTasks / milestonesCount;
          const meanProjectAssignedTasks = _
            .chain(tasks)
            .reject(o => o.assigneeId === null || o.assigneeId === vm.user.data.id)
            .value() / projectUsersCount;

          const milestonesUpActivities = _.map(vm.user.milestones.activities, (activity) => {
            activity.milestone = _.find(milestones, { id: activity.milestoneId });
            return activity;
          });

          // build milestones modal for a project
          vm.milestones[projectId] = {
            count: milestonesCount,
            activities: milestonesUpActivities,
            participatedCount: participatedMilestonesCount,
            notParticipatedCount: notParticipatedMilestonesCount,
            meanAssigned: meanAssignedTasks,
            projectMeanAssigned: meanProjectAssignedTasks,
            rate: participationRate
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
