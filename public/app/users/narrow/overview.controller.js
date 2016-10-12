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
      Users.drive.getFiles(userId, parent.dateRange.selected.days),
      Users.drive.getRevisions(userId, parent.dateRange.selected.days),
      Users.tasks.getTasks(userId, parent.dateRange.selected.days),
      Users.milestones.getMilestones(userId, parent.dateRange.selected.days),
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

    const processPayload = (project, commits, files, revisions, tasks, milestones,
      projectFiles, projectRevisions, projectCommits, projectTasks, projectMilestones) => {
      // Inject results from payload into view model
      vm.project = project;
      vm.commits = commits;
      vm.commitsCount = commits.length;
      vm.files = files;
      vm.filesCount = files.length;
      vm.revisions = revisions;
      vm.revisionsCount = revisions.length;
      vm.tasks = tasks;
      vm.tasksCount = tasks.length;
      vm.milestones = milestones;
      vm.milestonesCount = milestones.length;

      const pFilesCount = projectFiles.length;
      const pRevisionsCount = projectRevisions.length;
      const pCommitsCount = projectCommits.length;
      const pTasksCount = projectTasks.length;
      const pMilestonesCount = projectMilestones.length;

      // Calculate commit mean time as well as standard deviation
      // Naive implementation: Reduction of array to calculate SD
      const projectCreationTime = moment(vm.project.created_at, 'YYYY-MM-DD HH:mm:ss');
      const currentDate = moment();
      const elapsedDuration = currentDate.diff(projectCreationTime, 'hours');
      vm.meanCommitTime = elapsedDuration / vm.commitsCount;
      vm.deviationCommitTime = (_.reduce(vm.commits, (vsum, hours) => {
        return vsum + Math.pow(hours - vm.meanCommitTime, 2);
      })) / vm.commitsCount;

      // Calculate percentage contributions (commits and LOC)
      vm.commitContrib = _.round((vm.commitsCount / pCommitsCount) * 100, 2);
      vm.locAddition = _.sumBy(vm.commits, 'additions');
      vm.locDeletion = _.sumBy(vm.commits, 'deletions');
      vm.locChanged = vm.locAddition + vm.locDeletion;

      const pLocAddition = _.sumBy(projectCommits, 'additions');
      const pLocDeletion = _.sumBy(projectCommits, 'deletions');
      const pLocChanged = pLocAddition + pLocDeletion;

      vm.locContrib = _.round((vm.locChanged / pLocChanged) * 100, 2);

      // number of files contributed
      vm.filesContrib = _.round((vm.filesCount / pFilesCount) * 100, 2);

      // number of revisions made
      vm.revisionsContrib = _.round((vm.revisionsCount / pRevisionsCount) * 100, 2);

      // Calculate revision mean time as well as standard deviation
      // Naive implementation: Reduction of array to calculate SD
      vm.meanRevisionTime = elapsedDuration / vm.revisionsCount;
      vm.deviationRevisionTime = (_.reduce(vm.revisions, (vsum, hours) => {
        return vsum + Math.pow(hours - vm.meanRevisionTime, 2);
      })) / vm.revisionsCount;

      // Display breakdown of user's task activities
      vm.tCreated = _.filter(vm.tasks, { activity: 'C' });
      vm.tCreatedCount = vm.tCreated.length;
      vm.tDone = _.filter(vm.tasks, { activity: 'D' });
      vm.tDoneCount = vm.tDone.length;
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

      // Calculate team comparison of task activities
      vm.tasksContrib = _.round((vm.tasksCount / pTasksCount) * 100, 2);

      // Display breakdown of user's milestone activities
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

      // Calculate mean task completion per milestone
      vm.milestonesContrib = vm.tDone / pMilestonesCount;
      vm.msTeamContrib = (_.filter(vm.tasks, { activity: 'D' }).length - vm.tDone) / vm.project.members.length / pMilestonesCount;
    };

    $q
      .all(retrievalFunctions)
      .then(processResponse)
      .then(processPayload)
      .catch($log.error);
  }
})();
