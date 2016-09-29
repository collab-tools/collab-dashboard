/**
 * Controller must populate all the information required by the global github interface.
 * Refer to documentation for specific requirements.
 * @namespace GithubCtrl
 */

/* global moment */
(() => {
  angular
    .module('app')
    .controller('githubCtrl', githubCtrl);

  githubCtrl.$inject = ['$scope', '$log', '_', 'Github'];

  function githubCtrl($scope, $log, _, Github) {
    const vm = this;
    const parent = $scope.$parent;

    vm.subtitle = 'Collab Statistics on GitHub Usage';

    const processResponse = (response) => {
      // process commits to retrieve length, deviation, commits overtime
      vm.commits = response.data.commits;
      vm.commitsCount = vm.commits.length;
      vm.uniqueCommits = _.uniqBy(vm.commits, 'githubLogin');
      vm.commitsByDate = _.groupBy(vm.commits, (commit) => {
        return moment(commit.date).startOf('day');
      });
      // map each date grouping to number of commits on that day
      vm.commitsByDate = _.mapValues(vm.commitsByDate, (commits) => {
        return commits.length;
      });

      // Calculate mean and standard deviation
      vm.meanCommits = vm.commitsCount / parent.dateRange.selected.days;
      vm.maxPair = _.maxBy(_.toPairs(vm.commitsByDate), (dateCount) => { return dateCount[1]; });
      vm.minPair = _.minBy(_.toPairs(vm.commitsByDate), (dateCount) => { return dateCount[1]; });
      vm.deviationCommits = _.reduce(vm.commitsByDate, (sum, count) => {
        return sum + Math.pow(count - vm.meanCommits, 2);
      }) / parent.dateRange.selected.days;

      // calculate utilization rate using total users count and unique commits
      vm.usersCount = response.data.usersCount;
      vm.utilizationRate = _.round(vm.uniqueCommits / vm.usersCount, 1);

      // newly created repositories in given date range
      vm.reposCount = response.data.reposCount;

      // process releases with the number of release with tags, releases count
      vm.releases = response.data.releases;
      vm.releasesCount = vm.releases.length;

      // get number of releases tagged according to tracked tags
      // TODO: Allow admins to add in tags to track
      const sampleTags = ['MS1', 'MS2', 'MS3'];
      vm.taggedCommits = _.filter(vm.commits, (commit) => {
        return _.includes(sampleTags, commit.tagName);
      });
    };

    Github
      .getOverview(parent.dateRange.selected.days)
      .then(processResponse, $log.error);

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
