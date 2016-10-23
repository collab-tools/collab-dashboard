/**
 * Main controller of the dashboard that makes global variables and methods
 * available to other sub-controllers.
 * @namespace AppCtrl
 */

(() => {
  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = [
    '$scope', '$localStorage', '$location', '$rootScope',
    '$anchorScroll', '$timeout', '$window', 'moment', 'Auth'
  ];

  function AppCtrl($scope, $localStorage, $location, $rootScope,
    $anchorScroll, $timeout, $window, moment, Auth) {
    const vm = $scope;

    vm.currentUser = Auth.currentUser();

    vm.dateRange = [
      { display: 'Last 7 Days', start: moment().startOf('day').subtract(7, 'days').valueOf(), end: moment().valueOf() },
      { display: 'Last 30 Days', start: moment().startOf('day').subtract(30, 'days').valueOf(), end: moment().valueOf() },
      { display: 'Last 90 Days', start: moment().startOf('day').subtract(90, 'days').valueOf(), end: moment().valueOf() },
      { display: 'All Time', start: 0, end: moment().valueOf() }
    ];
    vm.dateRange.selected = vm.dateRange[0];

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
