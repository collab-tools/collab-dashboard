/**
 * Controller must populate all the information required by the global github interface.
 * Refer to documentation for specific requirements.
 * @namespace GithubCtrl
 */

(() => {
  angular
    .module('app')
    .controller('githubCtrl', githubCtrl);

  githubCtrl.$inject = ['$scope', '$log', '$q', '_', 'moment', 'Github', 'Users', 'Projects'];

  function githubCtrl($scope, $log, $q, _, moment, Github, Users, Projects) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      const start = parent.dateRange.selected.start;
      const end = parent.dateRange.selected.end;
      const range = moment(end).diff(moment(start), 'days');
      vm.start = start;
      vm.end = end;
      const processResponse = (response) => {
        // replaceable by spread operator with proper promise support
        vm.repos = response[0].data;
        vm.commits = response[1].data;
        vm.releases = response[2].data;
        vm.participating = response[3].data;
        vm.users = response[4].data;
        vm.projects = response[5].data;

        // create project map for quick access
        vm.projectsMap = _.keyBy(vm.projects, 'id');

        // process commits to retrieve length, deviation, commits overtime
        vm.commitsCount = vm.commits.length;

        // map each date grouping to number of commits on that day
        vm.commitsByDate = _
          .chain(vm.commits)
          .groupBy(commit => moment(commit.date).startOf('day').valueOf())
          .mapValues(commit => commit.length)
          .toPairs()
          .value();

        // calculate mean and standard deviation
        vm.meanCommits = vm.commitsCount / range;
        vm.maxPair = _.maxBy(vm.commitsByDate, (dateCount) => {
          return dateCount[1];
        });
        vm.minPair = _.minBy(vm.commitsByDate, (dateCount) => {
          return dateCount[1];
        });
        vm.deviationCommits = _.reduce(vm.commitsByDate, (sum, pair) => {
          return sum + Math.pow(pair[1] - vm.meanCommits, 2);
        }, 0) / range;

        // calculate utilization rate using total users count and unique commits
        vm.participatingCount = vm.participating.length;
        vm.usersCount = vm.users.length;
        vm.utilizationRate = _.round(vm.participatingCount / vm.usersCount, 1);

        // newly created repositories in given date range
        vm.reposCount = vm.repos.length;

        // process releases with the number of release with tags, releases count
        vm.releases = _.map(vm.releases, (release) => {
          release.date = moment(release.date).format('DD/MM/YYYY HH:mm:ss');
          return release;
        });
        vm.releasesCount = vm.releases.length;

        // get number of releases tagged according to tracked tags
        // TODO: Allow admins to add in tags to track
        const sampleTags = ['MS1', 'MS2', 'MS3', '1'];
        vm.trackedReleases = _.filter(vm.releases, (release) => {
          return _.includes(sampleTags, release.tagName);
        });
        vm.trackedReleasesCount = vm.trackedReleases.length;
      };

      $q
        .all([
          Github.getRepositories(start, end),
          Github.getCommits(start, end),
          Github.getReleases(start, end),
          Github.getParticipatingUsers(start, end),
          Users.getUsers(0, end),
          Projects.getProjects(0, end)
        ])
        .then(processResponse, $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on GitHub Usage';
      vm.requestData();
    })();

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
