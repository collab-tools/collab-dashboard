'use strict';

(() => {
  function runBlock($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }

  runBlock.$inject = ['$rootScope', '$state', '$stateParams'];

  function config($stateProvider, $urlRouterProvider, MODULE_CONFIG) {
    function load(srcs, callback) {
      return {
        deps: ['$ocLazyLoad', '$q',
          function ($ocLazyLoad, $q) {
            const deferred = $q.defer();
            let promise = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if (!promise) {
              promise = deferred.promise;
            }
            angular.forEach(srcs, (src) => {
              promise = promise.then(() => {
                angular.forEach(MODULE_CONFIG, (module) => {
                  if (module.name === src) {
                    src = module.module ? module.name : module.files;
                  }
                });
                return $ocLazyLoad.load(src);
              });
            });
            deferred.resolve();
            return callback ? promise.then(() => {
              return callback();
            }) : promise;
          }]
      };
    }

    function getParams(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp(`'[\\?&]${name}=([^&#]*)`);
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const layout = '../views/layout/layout.html';
    const dashboard = '../views/dashboard/dashboard.html';
    const projects = '../views/page/projects.html';
    const users = '../views/page/users.html';
    const github = '../views/page/github.html';
    const drive = '../views/page/drive.html';
    const cloud = '../views/page/cloud.html';
    const milestones = '../views/page/milestones.html';
    const tasks = '../views/page/tasks.html';
    const user = '../views/page/users/overview.html';
    const project = '../views/page/projects/overview.html';

    $urlRouterProvider
      .otherwise('/app/dashboard');

    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          '': {
            templateUrl: layout
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: dashboard,
        data: {
          title: 'Collab Dashboard'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.projects', {
        url: '/projects',
        templateUrl: projects,
        data: {
          title: 'Projects'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.users', {
        url: '/users',
        templateUrl: users,
        data: {
          title: 'Users'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.github', {
        url: '/github',
        templateUrl: github,
        data: {
          title: 'GitHub'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.drive', {
        url: '/drive',
        templateUrl: drive,
        data: {
          title: 'Google Drive'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.cloud', {
        url: '/cloud',
        templateUrl: cloud,
        data: {
          title: 'Cloud IDE'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.tasks', {
        url: '/tasks',
        templateUrl: tasks,
        data: {
          title: 'Tasks'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.milestones', {
        url: '/milestones',
        templateUrl: milestones,
        data: {
          title: 'Milestones'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.user', {
        url: '/user',
        templateUrl: user,
        data: {
          title: 'User Overview: Hooi Tong'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      })
      .state('app.project', {
        url: '/project',
        templateUrl: project,
        data: {
          title: 'Project Overview: Project Gene'
        },
        controller: 'ChartCtrl',
        resolve: load(['scripts/controllers/chart.js'])
      });
  }

  config.$inject = ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG'];

  angular
    .module('app')
    .run(runBlock)
    .config(config);
})();
