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
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const processResponse = (response) => {
        // replaceable by spread operator with proper promise support
        const repos = response[0].data;
        const commits = response[1].data;
        const releases = response[2].data;
        const participating = response[3].data;
        const users = response[4].data;
        const projects = response[5].data;

        // build projects modal for view usages
        vm.projects = {
          data: projects,
          map: _.keyBy(projects, 'id') // create project map for quick access
        };

        // build commits modal for view usages
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
        const meanCommits = commitsCount / vm.range.days;
        const maxPair = _.maxBy(commitsByDate, (dateCount) => {
          return dateCount[1];
        });
        const minPair = _.minBy(commitsByDate, (dateCount) => {
          return dateCount[1];
        });
        const deviationCommits = _.reduce(commitsByDate, (sum, pair) => {
          return sum + Math.pow(pair[1] - meanCommits, 2);
        }, 0) / vm.range.days;

        // build commits modal for view usages
        vm.commits = {
          data: commits,
          count: commitsCount,
          grouped: commitsByDate,
          mean: meanCommits,
          max: maxPair ? maxPair[1] : 0,
          maxDate: maxPair ? moment(parseInt(maxPair[0], 10)).format('DD/MM/YY') : 'N/A',
          min: minPair ? minPair[1] : 0,
          minDate: minPair ? moment(parseInt(minPair[0], 10)).format('DD/MM/YY') : 'N/A',
          deviation: deviationCommits
        };

        // calculate utilization rate using total users count and unique commits
        const participatingCount = participating.length;
        const usersCount = users.length;
        const utilizationRate = _.round(participatingCount / usersCount, 1);

        // build participation and users modal for view usages
        vm.participation = {
          data: participating,
          count: participatingCount,
          utilization: utilizationRate
        };

        vm.users = {
          data: users,
          count: usersCount,
        };

        // build repos modal for view usages
        // newly created repositories in given date range
        vm.repos = {
          data: repos,
          count: repos.length
        };

        // build releases modal for view usages
        // process releases with the number of release with tags, releases count
        const formattedReleases = _.map(releases, (release) => {
          release.date = moment(release.date).format('DD/MM/YYYY HH:mm:ss');
          return release;
        });
        const releasesCount = formattedReleases.length;

        // get number of releases tagged according to tracked tags
        // TODO: Allow admins to add in tags to track
        const sampleTags = ['MS1', 'MS2', 'MS3', '1'];
        const trackedReleases = _.filter(formattedReleases, (release) => {
          return _.includes(sampleTags, release.tagName);
        });
        const trackedReleasesCount = trackedReleases.length;
        vm.releases = {
          data: formattedReleases,
          count: releasesCount,
          tracked: trackedReleases,
          trackedCount: trackedReleasesCount
        };
      };

      $q
        .all([
          Github.getRepositories(vm.range.start, vm.range.end),
          Github.getCommits(vm.range.start, vm.range.end),
          Github.getReleases(vm.range.start, vm.range.end),
          Github.getParticipatingUsers(vm.range.start, vm.range.end),
          Users.getUsers(0, vm.range.end),
          Projects.getProjects(0, vm.range.end)
        ])
        .then(processResponse, $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on GitHub Usage';
      vm.requestData();
    })();
  }
})();
