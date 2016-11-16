/**
 * Main controller of the dashboard that makes global variables and methods
 * available to other sub-controllers.
 * @namespace AppCtrl
 */

(() => {
  angular
    .module('app')
    .filter('propsFilter', propsFilter)
    .controller('AppCtrl', AppCtrl);

  function propsFilter() {
    function filter(items, props) {
      let out = [];

      if (angular.isArray(items)) {
        items.forEach((item) => {
          let itemMatches = false;

          const keys = Object.keys(props);
          for (let i = 0; i < keys.length; i += 1) {
            const prop = keys[i];
            const text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }
      return out;
    }
    return filter;
  }

  AppCtrl.$inject = [
    '$scope', '$localStorage', '$location', '$rootScope', '$anchorScroll',
    '$timeout', '$window', '_', 'moment', 'Auth', 'Users', 'Projects'
  ];

  function AppCtrl($scope, $localStorage, $location, $rootScope, $anchorScroll,
    $timeout, $window, _, moment, Auth, Users, Projects) {
    const vm = $scope;

    vm.searchables = [];

    Users.getUsers(0, moment().valueOf())
      .then((response) => {
        _.forEach(response.data, (user) => {
          vm.searchables.push({
            type: 'user',
            id: user.id,
            name: user.displayName,
            email: user.email,
            displayPicture: user.displayImage,
            repo: ''
          });
        });
      });

    Projects.getProjects(0, moment().valueOf())
      .then((response) => {
        _.forEach(response.data, (project) => {
          vm.searchables.push({
            type: 'project',
            id: project.id,
            name: project.content,
            email: '',
            displayPicture: '',
            repo: `${project.githubRepoOwner}/${project.githubRepoName}`
          });
        });
      });


    vm.resetSearch = ($select) => {
      $select.selected = '';
    };

    vm.groupSearchables = (searchable) => {
      if (searchable.type === 'user') return 'Users';
      else if (searchable.type === 'project') return 'Projects';
    };

    vm.updateUserDisplay = function () {
      vm.currentUser = _.omit(Auth.currentUser(), 'settings');
    };
    vm.updateUserDisplay();
    if (Auth.isLoggedIn()) {
      vm.settings = Auth.currentUser().settings;
      vm.settings.ranges = _.sortBy(vm.settings.ranges, range => range[0]) || [];

      vm.defaultRange = [
        { display: 'Last 7 Days', start: moment().startOf('day').subtract(7, 'days').valueOf(), end: moment().valueOf() },
        { display: 'Last 30 Days', start: moment().startOf('day').subtract(30, 'days').valueOf(), end: moment().valueOf() },
        { display: 'Last 90 Days', start: moment().startOf('day').subtract(90, 'days').valueOf(), end: moment().valueOf() },
        { display: 'All Time', start: 1451577600000, end: moment().valueOf() }
      ];

      vm.updateRangeDisplay = function () {
        vm.userRange = [];
        _.forEach(vm.settings.ranges, (range) => {
          vm.userRange.push({
            display: range[1],
            start: moment(range[2]).startOf('day').valueOf(),
            end: moment(range[3]).startOf('day').valueOf()
          });
        });
        vm.dateRange = _.concat(vm.defaultRange, vm.userRange);
        vm.dateRange.selected = vm.dateRange[0];
      };

      vm.updateRangeDisplay();
    }
    vm.isIE = isIE();
    vm.isMobile = isSmartDevice();
    vm.app = {
      name: 'Collab',
      version: '1.0.0',
      color: {
        primary: '#0cc2aa',
        accent: '#a88add',
        warn: '#fcc100',
        info: '#6887ff',
        success: '#6cc788',
        warning: '#f77a99',
        danger: '#f44455',
        white: '#ffffff',
        light: '#f1f2f3',
        dark: '#2e3e4e',
        black: '#2a2b3c'
      }
    };

    vm.logout = function () {
      Auth.logout();
      $location.path('/auth/login');
    };

    $scope.$on('$stateChangeSuccess', openPage);

    function openPage() {
      $location.hash('content');
      $anchorScroll();
      $location.hash('');
    }

    vm.goBack = function () {
      $window.history.back();
    };

    function isSmartDevice() {
      const ua = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
      return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/)
        .test(ua);
    }

    function isIE() {
      return !!navigator.userAgent.match(/MSIE/i) ||
        !!navigator.userAgent.match(/Trident.*rv:11\./);
    }
  }
})();
