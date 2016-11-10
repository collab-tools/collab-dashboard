/**
 * Controller must populate all the information required by a project's interface.
 * Refer to documentation for specific requirements.
 * @namespace ProjectSummaryCtrl
 */

(() => {
  angular
    .module('app')
    .controller('projectSummaryCtrl', projectSummaryCtrl);

  projectSummaryCtrl.$inject = [
    '$scope', '$state', '$stateParams', '$log', '$q', '_', 'moment', 'googleMIME', 'Projects'
  ];

  function projectSummaryCtrl($scope, $state, $stateParams, $log, $q, _, moment, googleMIME, Projects) {
    const vm = this;
    const parent = $scope.$parent;
    const projectId = $stateParams.projectId;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const stripHeaders = response => _.map(response, 'data');
      const processResponse = (project, commits, releases, contributors, stats, driveActivities, files,
        changes, tasks, taskActivities, milestones, elapsedMilestones, milestonesActivities) => {
        const projectUsers = project.users;
        const projectUsersCount = projectUsers.length;
        const projectSpan = moment().diff(moment(project.createdAt), 'days');

        // build projects modal for view usages
        vm.project = {
          data: project,
          users: projectUsers,
          usersCount: projectUsersCount,
          span: projectSpan
        };

        // create basic maps from alias to display name
        vm.githubDisplay = {};
        vm.emailDisplay = {};
        vm.idDisplay = {};
        _.forEach(projectUsers, (user) => {
          vm.githubDisplay[user.githubLogin] = user.displayName;
          vm.emailDisplay[user.email] = user.displayName;
          vm.idDisplay[user.id] = user.displayName;
        });

        // configure titles and subtitles based on retrieved project
        $state.current.data = { title: `Project: ${vm.project.data.content}` };
        vm.subtitle = `Summary on ${vm.project.data.content}`;

        // process commits to retrieve length, deviation, commits overtime
        const commitsCount = commits.length;

        // map each date grouping to number of commits on that day
        const commitsByDate = _
          .chain(commits)
          .groupBy(commit => moment(commit.date).startOf('day').valueOf())
          .mapValues(commits => commits.length)
          .toPairs()
          .value();

        // calculate mean and standard deviation
        const meanCommits = commitsCount / projectSpan;
        const deviationCommits = _.reduce(commitsByDate, (sum, pair) => {
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

        // compute distribution of commits over time for each member
        const commitsByUser = _
          .chain(commits)
          .groupBy(commits, 'githubLogin')
          .mapKeys((value, key) => _.find(projectUsers, 'githubLogin').displayName)
          .value();
        const commitsCountByUser = _
          .mapValues(commitsByUser, value => value.length);
        const commitsCountByUserDate = _
          .mapValues(commitsByUser, (commits) => {
            return _
              .chain(commits)
              .groupBy(commit => moment(commit.date).startOf('day').valueOf())
              .mapValues(commits => commits.length)
              .toPairs()
              .value();
          });
        const commitsPercentageByUser = _
          .mapValues(commitsCountByUser, value => value / commitsCount);

        // compute contribution mean and deviation between members
        const meanUserCommits = commitsCount / projectUsersCount;
        const deviationUserCommits = _.reduce(commitsCountByUser, (sum, count) => {
          return sum + Math.pow(count - meanUserCommits, 2);
        }, 0) / projectUsersCount;

        // build github modal for view usages
        vm.github = {
          commits: {
            data: commits,
            count: commitsCount,
            groupedDate: commitsByDate,
            groupedUsers: commitsCountByUserDate,
            groupedUsersPercentage: commitsPercentageByUser,
            mean: meanCommits,
            deviation: deviationCommits,
            lines: linesChanged,
            userMean: meanUserCommits,
            userDeviation: deviationUserCommits
          },
          releases: {
            data: releases
          }
        };

        // calculate number of changes made and distribution of changes over time
        const filesCount = files.length;
        const changesCount = changes.length;
        const changesByDate = _
          .chain(changes)
          .groupBy(change => moment(change.date).startOf('day').valueOf())
          .mapValues(changes => changes.length)
          .toPairs()
          .value();

        // calculate mean and deviation of changes
        const meanChanges = changesCount / projectSpan;
        const maxChangePair = _.maxBy(changesByDate, (dateCount) => {
          return dateCount[1];
        });
        const minChangePair = _.minBy(changesByDate, (dateCount) => {
          return dateCount[1];
        });
        const deviationChanges = _.reduce(changesByDate, (sum, pair) => {
          return sum + Math.pow(pair[1] - meanChanges, 2);
        }, 0) / projectSpan;

        // compute distribution of changes over time for each member
        const changesByUser = _.groupBy(changes, 'email');
        const changesCountByUser = _.map(changesByUser, value => value.length);

        // compute contribution deviation of changes between members
        const meanUserChanges = changesCount / projectUsersCount;
        const deviationUserChanges = _.reduce(changesCountByUser, (sum, count) => {
          return sum + Math.pow(count - meanUserChanges, 2);
        }, 0) / projectUsersCount;

        driveActivities = _.map(driveActivities, (activity) => {
          if (!activity.fileExtension) activity.fileExtension = googleMIME[activity.fileMIME];
          return activity;
        });

        const driveActivitiesCount = driveActivities.length;

        // build drive modal for view usages
        vm.drive = {
          activities: {
            data: driveActivities,
            count: driveActivitiesCount
          },
          files: {
            data: files,
            count: filesCount,
          },
          changes: {
            data: changes,
            count: changesCount,
            groupedDate: changesByDate,
            groupedUsers: changesCountByUser,
            mean: meanChanges,
            max: maxChangePair ? maxChangePair[1] : 0,
            maxDate: maxChangePair ? moment(parseInt(maxChangePair[0], 10)).format('DD/MM/YY') : 'N/A',
            min: minChangePair ? minChangePair[1] : 0,
            minDate: minChangePair ? moment(parseInt(minChangePair[0], 10)).format('DD/MM/YY') : 'N/A',
            deviation: deviationChanges,
            userMean: meanUserChanges,
            userDeviation: deviationUserChanges
          }
        };

        // calculate task activities breakdown
        const tasksCount = tasks.length;
        const createdTasks = _.filter(taskActivities, { activity: 'C' });
        const createdTasksCount = createdTasks.length;
        const doneTasks = _.filter(taskActivities, { activity: 'D' });
        const doneTasksCount = doneTasks.length;
        const pendingTasks = _.filter(tasks, { completedOn: null });
        const pendingTasksCount = pendingTasks.length;
        const assignedTasks = _.pull(tasks, { assigneeId: null });
        const assignedTasksCount = assignedTasks.length;

        // compute distribution of tasks over time for each member
        const tasksByUser = _.groupBy(tasks, 'assigneeId');
        const tasksCountByUser = _.map(tasksByUser, value => value.length);

        // compute contribution deviation of tasks between members
        const meanUserTasks = assignedTasksCount / projectUsersCount;
        const meanUserDeviation = _.reduce(tasksCountByUser, (sum, count) => {
          return sum + Math.pow(count - meanUserTasks, 2);
        }, 0) / projectUsersCount;

        const taskActivitiesCount = taskActivities.length;
        taskActivities = _.map(taskActivities, (activity) => {
          activity.task = _.find(tasks, { id: activity.taskId });
          return activity;
        });

        // build tasks modal for view usages
        vm.tasks = {
          data: tasks,
          count: tasksCount,
          activities: {
            data: taskActivities,
            count: taskActivitiesCount
          },
          created: createdTasks,
          createdCount: createdTasksCount,
          done: doneTasks,
          doneCount: doneTasksCount,
          pending: pendingTasks,
          pendingCount: pendingTasksCount,
          assigned: assignedTasks,
          assignedCount: assignedTasksCount,
          userMean: meanUserTasks,
          userDeviation: meanUserDeviation
        };

        // calculate the number of milestones completed and time taken to complete
        const milestonesCount = milestones.length;
        const elapsedMilestonesCount = elapsedMilestones.length;
        const completedMilestones = _.filter(elapsedMilestones, (milestone) => {
          return _.every(milestone.tasks, task => task.completedOn);
        });
        const completedMilestonesCount = completedMilestones.length;
        const completedMilestonesDuration = _.map(completedMilestones, (milestone) => {
          return moment(milestone.deadline).diff(moment(milestone.createdAt), 'hours', true);
        });
        const completedMilestonesMax = _.max(completedMilestonesDuration);
        const completedMilestonesMin = _.min(completedMilestonesDuration);
        const completedMilestonesMean = _
          .sum(completedMilestonesDuration) / completedMilestonesCount;
        const completedMilestonesDeviation = _
          .reduce(completedMilestonesDuration, (sum, duration) => {
            return sum + Math.pow(duration - completedMilestonesMean, 2);
          }, 0) / completedMilestonesCount;

        // calculate the number of missed milestones
        const milestonesMissed = _.filter(elapsedMilestones, (milestone) => {
          return _.some(milestone.tasks, task => !task.completedOn);
        });
        const milestonesMissedCount = milestonesMissed.length;
        const completionRate = completedMilestonesCount / elapsedMilestonesCount;

        const milestonesActivitiesCount = milestonesActivities.length;
        milestonesActivities = _.map(milestonesActivities, (activity) => {
          activity.milestone = _.find(milestones, { id: activity.milestoneId });
          return activity;
        });

        // build milestones modal for view usages
        vm.milestones = {
          data: milestones,
          activities: {
            data: milestonesActivities,
            count: milestonesActivitiesCount,
          },
          count: milestonesCount,
          elapsed: elapsedMilestones,
          elapsedCount: elapsedMilestonesCount,
          completed: completedMilestones,
          completedMax: completedMilestonesMax,
          completedMin: completedMilestonesMin,
          completedCount: completedMilestonesCount,
          completedMean: completedMilestonesMean,
          completedDeviation: completedMilestonesDeviation,
          missed: milestonesMissed,
          missedCount: milestonesMissedCount,
          rate: completionRate
        };

      };

      $q
        .all([
          Projects.getProject(projectId),
          Projects.github.getCommits(projectId, vm.range.start, vm.range.end),
          Projects.github.getReleases(projectId, vm.range.start, vm.range.end),
          Projects.github.getContributors(projectId),
          Projects.github.getStatistics(projectId),
          Projects.drive.getActivities(projectId, vm.range.start, vm.range.end),
          Projects.drive.getFiles(projectId, vm.range.start, vm.range.end),
          Projects.drive.getChanges(projectId, vm.range.start, vm.range.end),
          Projects.tasks.getTasks(projectId, vm.range.start, vm.range.end),
          Projects.tasks.getActivities(projectId, vm.range.start, vm.range.end),
          Projects.milestones.getMilestones(false, projectId, vm.range.start, vm.range.end),
          Projects.milestones.getMilestones(true, projectId, vm.range.start, vm.range.end),
          Projects.milestones.getActivities(projectId, vm.range.start, vm.range.end)
        ])
        .then(stripHeaders, $log.error)
        .then(_.spread(processResponse), $log.error);
    };

    (() => {
      vm.requestData();
    })();
  }
})();
