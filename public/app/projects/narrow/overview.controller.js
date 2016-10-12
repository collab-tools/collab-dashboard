/**
 * Controller must populate all the information required by a project's interface.
 * Refer to documentation for specific requirements.
 * @namespace ProjectOverviewCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('projectOverviewCtrl', projectOverviewCtrl);

  projectOverviewCtrl.$inject = ['$scope', '$stateParams', '$log', '$q', '_', 'Projects'];

  function projectOverviewCtrl($scope, $stateParams, $log, $q, _, Projects) {
    const vm = this;
    const parent = $scope.$parent;
    vm.subtitle = 'Statistics on Team Gene\'s Usage';

    const projectId = $stateParams.projectId;

    const retrievalFunctions = [
      Projects.getProject(projectId),
      Projects.drive.getFiles(projectId, parent.dateRange.selected.days),
      Projects.drive.getRevisions(projectId, parent.dateRange.selected.days),
      Projects.github.getCommits(projectId, parent.dateRange.selected.days),
      Projects.tasks.getTasks(projectId, parent.dateRange.selected.days),
      Projects.milestones.getMilestones(projectId, parent.dateRange.selected.days)
    ];

    // Helper function to strip metadata from HTTP response
    const processResponse = (responses) => {
      return _.map(responses, (response) => {
        return response.data;
      });
    };

    const processPayload = (project, files, revisions, commits, tasks, milestones) => {
      vm.project = project;
      vm.files = files;
      vm.revisions = revisions;
      vm.commits = commits;
      vm.tasks = tasks;
      vm.milestones = milestones;

      // Retrieve relevant information from project
      const projectCreationTime = moment(vm.project.created_at, 'YYYY-MM-DD HH:mm:ss');
      const currentDate = moment();
      const elapsedDuration = currentDate.diff(projectCreationTime, 'hours');
      vm.members = vm.project.members;
      vm.memberCount = project.members.length;

      // Calculate breakdown of commits (team)
      vm.commitCount = vm.commits.length;
      vm.locAddition = _.sumBy(vm.commits, 'additions');
      vm.locDeletion = _.sumBy(vm.commits, 'deletions');
      vm.locChanged = vm.locAddition + vm.locDeletion;

      vm.meanCommitTime = elapsedDuration / vm.commitCount;
      vm.deviationCommitTime = (_.reduce(vm.commits, (vsum, hours) => {
        return vsum + Math.pow(hours - vm.meanCommitTime, 2);
      })) / vm.commitCount;

      vm.memberCommits = _.map(vm.project.members, (member) => {
        return _.filter(vm.commits, { githubLogin: member.github_login });
      });

      vm.memberPercentage = _.map(vm.memberCommits, (commits) => {
        return commits.length;
      });

      // Calculate team comparison of commits
      vm.commitMean = vm.commitCount / vm.memberCount;
      vm.commitDeviation = _.reduce(vm.memberCommits, (vsum, commits) => {
        return vsum + Math.pow(commits - vm.commitMean, 2);
      }) / vm.commitCount;

      // Calculate breakdown of revisions (team)
      vm.revisionCount = vm.revisions.length;
      vm.revisionTimeMean = elapsedDuration / vm.revisionCount;
      vm.revisionTimeDeviation = _.reduce(vm.revisions, (vsum, hours) => {
        return vsum + Math.pow(hours - vm.revisionTimeMean, 2);
      }) / vm.revisionsCount;

      // Calculate deviation of revisions (individual)
      vm.memberRevisions = _.map(vm.project.members, (member) => {
        return _.filter(vm.revisions, { googleId: member.google_id });
      });
      vm.revisionMean = vm.revisionCount / vm.memberCount;
      vm.revisionDeviation = _.reduce(vm.memberRevisions, (vsum, revisions) => {
        return vsum + Math.pow(revisions - vm.revisionMean, 2);
      }) / vm.revisionCount;

      // Calculate breakdown of files (team)
      vm.fileCount = vm.files.length;

      // Calculate breakdown of tasks (team)
      vm.tCreated = _.filter(vm.tasks, { activity: 'C' });
      vm.tCreatedCount = vm.tCreated.length;
      vm.tDone = _.filter(vm.tasks, { activity: 'D' });
      vm.tDoneCount = vm.tDone.length;
      vm.tAssigned = _.filter(vm.tasks, { activity: 'A' });
      vm.tAssignedCount = vm.tAssigned.length;
      vm.tCompletedStart = _.sortBy(_.intersectionBy(vm.tCreated, vm.tDone, 'taskId'), 'taskId');
      vm.tCompletedEnd = _.intersectionBy(vm.tDone, vm.tCreated, 'taskId');
      vm.tCompletedCount = vm.tCompletedStart.length;

      if (vm.tCompletedEnd.length !== vm.tCompletedStart.length) $log.error('Something went wrong.');
      else {
        // Compute time difference for each task
        vm.tCompletionDurations = _.map(_.zip(vm.tCompletedStart, vm.tCompletedEnd),
          (activityPair) => {
            const startDate = moment(activityPair[0], 'YYYY-MM-DD HH:mm:ss');
            const endDate = moment(activityPair[1], 'YYYY-MM-DD HH:mm:ss');
            return endDate.diff(startDate, 'minutes');
          });

        // Calculate completion mean time as well as standard deviation
        // Naive implementation: Double Reduce following formula for mean and SD
        vm.tMeanCompletion = (_.reduce(vm.tCompletionDurations, (sum, minutes) => {
          return sum + minutes;
        })) / vm.tCompletionDurations.length;

        vm.tDeviationCompletion = (_.reduce(vm.tCompletionDurations, (vsum, minutes) => {
          return vsum + Math.pow(minutes - vm.tMeanCompletion, 2);
        })) / vm.tCompletionDurations.length;
      }

      // Calculate deviation of tasks assignees (individual)
      vm.memberTasksAssigned = _.map(vm.project.members, (member) => {
        return _.filter(vm.tasks, { activity: 'A', userId: member.id });
      });

      vm.memberTasksAssignedCount = _.map(vm.memberTasksAssigned, (tasks) => {
        return tasks.length;
      });

      vm.tasksAssignedMean = vm.tAssignedCount / vm.memberCount;
      vm.tasksAssignedDeviation = _.reduce(vm.memberTasksAssignedCount, (vsum, assignedCount) => {
        return vsum + Math.pow(assignedCount - vm.tasksAssignedMean, 2);
      }) / vm.memberCount;

      // Calculate breakdown of milestones (team)
      vm.msCreated = _.filter(vm.milestones, { activity: 'C' });
      vm.msCreatedCount = vm.msCreated.length;
      vm.msDone = _.filter(vm.milestones, { activity: 'D' });
      vm.msDoneCount = vm.msDone.length;
      vm.msCompletedStart = _.sortBy(_.intersectionBy(vm.msCreated, vm.msDone, 'milestoneId'), 'milestoneId');
      vm.msCompletedEnd = _.intersectionBy(vm.msDone, vm.msCreated, 'milestoneId');
      vm.msCompletedCount = vm.msCompletedStart.length;

      if (vm.msCompletedEnd.length !== vm.msCompletedStart.length) $log.error('Something went wrong.');
      else {
        // Compute time difference for each milestone
        vm.msCompletedDurations = _.map(
          _.zip(vm.msCompletedStart, vm.msCompletedEnd), (activityPair) => {
            const startDate = moment(activityPair[0], 'YYYY-MM-DD HH:mm:ss');
            const endDate = moment(activityPair[1], 'YYYY-MM-DD HH:mm:ss');
            return endDate.diff(startDate, 'minutes');
          });

        // Calculate completion mean time as well as standard deviation
        // Naive implementation: Double Reduce following formula for mean and SD
        vm.msMeanCompleted = (_.reduce(vm.msCompletedDurations, (sum, minutes) => {
          return sum + minutes;
        })) / vm.msCompletedDurations.length;

        vm.msDeviationCompleted = (_.reduce(vm.msCompletedDurations, (vsum, minutes) => {
          return vsum + Math.pow(minutes - vm.msMeanCompleted, 2);
        })) / vm.msCompletedDurations.length;
      }
    };

    $q
      .all(retrievalFunctions)
      .then(processResponse)
      .then(processPayload);

    // TODO: To be replaced with dynamic data
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
