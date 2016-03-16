/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */

(function () {
  'use strict';
  angular
    .module('app')
    .run(runBlock)
    .config(config);

  runBlock.$inject = ['$rootScope', '$state', '$stateParams'];

  function runBlock($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }

  config.$inject = ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG'];

  function config($stateProvider, $urlRouterProvider, MODULE_CONFIG) {

    var layout = '../views/layout/layout.html';
    var dashboard = '../views/dashboard/dashboard.html';
    var teams = '../views/page/teams.html';
    var users = '../views/page/users.html';
    var github = '../views/page/github.html';
    var drive = '../views/page/drive.html';
    var cloud = '../views/page/cloud.html';
    var milestones = '../views/page/milestones.html';
    var tasks = '../views/page/tasks.html';
    var user = '../views/page/users/overview.html';
    var team = '../views/page/teams/overview.html';

    $urlRouterProvider
      .otherwise('/app/dashboard');

    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          '': {
            templateUrl: layout,
          },
        },
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: dashboard,
        data: {
          title: 'Collab Dashboard',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js']),
      })
      /* Routing of general */
      .state('app.teams', {
        url: '/teams',
        templateUrl: teams,
        data: {
          title: 'Teams',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.users', {
        url: '/users',
        templateUrl: users,
        data: {
          title: 'Users',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.github', {
        url: '/github',
        templateUrl: github,
        data: {
          title: 'GitHub',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.drive', {
        url: '/drive',
        templateUrl: drive,
        data: {
          title: 'Google Drive',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })    
      .state('app.cloud', {
        url: '/cloud',
        templateUrl: cloud,
        data: {
          title: 'Cloud IDE',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.tasks', {
        url: '/tasks',
        templateUrl: tasks,
        data: {
          title: 'Tasks',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })    
      .state('app.milestones', {
        url: '/milestones',
        templateUrl: milestones,
        data: {
          title: 'Milestones',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.user', {
        url: '/user',
        templateUrl: user,
        data: {
          title: 'User Overview: Hooi Tong',
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })      
      .state('app.team', {
          url: '/team',
          templateUrl: team,
          data: {
            title: 'Team Overview: Team Gene',
          },
          controller: 'ChartCtrl',
          resolve: load(['scripts/controllers/chart.js'])
        });
          
    function load(srcs, callback) {
      return {
        deps: ['$ocLazyLoad', '$q',
                function ($ocLazyLoad, $q) {
            var deferred = $q.defer();
            var promise = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if (!promise) {
              promise = deferred.promise;
            }
            angular.forEach(srcs, function (src) {
              promise = promise.then(function () {
                angular.forEach(MODULE_CONFIG, function (module) {
                  if (module.name == src) {
                    src = module.module ? module.name : module.files;
                  }
                });
                return $ocLazyLoad.load(src);
              });
            });
            deferred.resolve();
            return callback ? promise.then(function () {
              return callback();
            }) : promise;
              }]
      }
    }

    function getParams(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }
})();