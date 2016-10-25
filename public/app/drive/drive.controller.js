/**
 * Controller must populate all the information required by the global drive interface.
 * Refer to documentation for specific requirements.
 * @namespace DriveCtrl
 */

(() => {
  angular
    .module('app')
    .controller('driveCtrl', driveCtrl);

  driveCtrl.$inject = [
    '$scope', '$log', '$q', '_', 'moment', 'googleMIME', 'Drive', 'Projects', 'Users'
  ];

  function driveCtrl($scope, $log, $q, _, moment, googleMIME, Drive, Projects, Users) {
    const vm = this;
    const parent = $scope.$parent;

    vm.requestData = () => {
      vm.range = {
        start: parent.dateRange.selected.start,
        end: parent.dateRange.selected.end,
        days: moment(parent.dateRange.selected.end).diff(moment(parent.dateRange.selected.start), 'days')
      };

      const processResponse = (response) => {
        const files = response[0].data;
        const changes = response[1].data;
        const participating = response[2].data;
        const users = response[3].data;
        const projects = response[4].data;

        // calculate the number of files and file type distribution
        const filesCount = files.length;
        const filesDistribution = _
          .chain(files)
          .map((file) => {
            if (!file.fileExtension) file.fileExtension = googleMIME[file.fileMIME];
            return file;
          })
          .groupBy('fileExtension')
          .mapValues(files => files.length)
          .toPairs()
          .map((pair) => {
            return { label: pair[0], data: pair[1] };
          })
          .value();

        // build files modal for view usages
        vm.files = {
          data: files,
          count: filesCount,
          distribution: filesDistribution
        };

        // calculate number of revisions made and distribution of revisions over time
        const changesCount = changes.length;
        const changesByDate = _
          .chain(changes)
          .groupBy(change => moment(change.date).startOf('day').valueOf())
          .mapValues(changes => changes.length)
          .toPairs()
          .value();

        // calculate mean and deviation of revisions
        const meanChanges = changesCount / vm.range.days;
        const maxPair = _.maxBy(changesByDate, (dateCount) => {
          return dateCount[1];
        });
        const minPair = _.minBy(changesByDate, (dateCount) => {
          return dateCount[1];
        });
        const deviationChanges = _.reduce(changesByDate, (sum, pair) => {
          return sum + Math.pow(pair[1] - meanChanges, 2);
        }, 0) / vm.range.days;

        // build changes modal for view usages
        vm.changes = {
          data: changes,
          count: changesCount,
          grouped: changesByDate,
          mean: meanChanges,
          max: maxPair ? maxPair[1] : 0,
          maxDate: maxPair ? moment(parseInt(maxPair[0], 10)).format('DD/MM/YY') : 'N/A',
          min: minPair ? minPair[1] : 0,
          minDate: minPair ? moment(parseInt(minPair[0], 10)).format('DD/MM/YY') : 'N/A',
          deviation: deviationChanges
        };

        // calculate number of active projects and inactive projects using drive
        const activeProjects = _.uniqBy(changes, 'projectId');
        const activeProjectsCount = activeProjects.length;
        const inactiveProjectsCount = projects.length - activeProjectsCount;


        // build projects modal for view usages
        vm.projects = {
          active: activeProjects,
          activeCount: activeProjectsCount,
          inactiveCount: inactiveProjectsCount
        };

        // calculate participation count and utilization rate
        const participatingCount = participating.length;
        const usersCount = users.length;
        const utilizationRate = participatingCount / usersCount;

        // build participation and users modal for view usages
        vm.participation = {
          data: participating,
          count: participatingCount,
          utilization: utilizationRate
        };

        vm.users = {
          data: users,
          count: usersCount
        };
      };

      $q
        .all([
          Drive.getFiles(vm.range.start, vm.range.end),
          Drive.getChanges(vm.range.start, vm.range.end),
          Drive.getParticipatingUsers(vm.range.start, vm.range.end),
          Users.getUsers(0, vm.range.end),
          Projects.getProjects(0, vm.range.end)
        ])
        .then(processResponse, $log.error);
    };

    (() => {
      vm.subtitle = 'Collab Statistics on Google Drive Usage';
      vm.requestData();
    })();
  }
})();
