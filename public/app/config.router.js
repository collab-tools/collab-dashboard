(() => {
  angular
    .module('app')
    .run(runBlock)
    .config(config);

  runBlock.$inject = ['$rootScope', '$state', '$stateParams', '$location', 'Auth'];

  function runBlock($rootScope, $state, $stateParams, $location, auth) {
    const LOGIN_PATH = '/auth/login';
    const DEFAULT_PATH = '/app/dashboard';
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    /* eslint-disable */
    $rootScope.$on('$locationChangeStart', (event, next, current) => {
      if (!auth.isLoggedIn() && $location.path() !== LOGIN_PATH ) {
          event.preventDefault();
          $location.path(LOGIN_PATH);
      } else if (auth.isLoggedIn() && $location.path() === LOGIN_PATH) {
          event.preventDefault();
          $location.path(DEFAULT_PATH);
      }
    });
    /* eslint-enable */
  }

  config.$inject = ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG'];

  function config($stateProvider, $urlRouterProvider, MODULE_CONFIG) {
    // Authentication Template
    const authLayout = 'layout/layout.auth.html';
    const login = 'authentication/login.html';

    // App Templates
    const appLayout = 'layout/layout.html';
    const dashboard = 'dashboard/dashboard.html';
    const projects = 'projects/global/projects.html';
    const users = 'users/global/users.html';
    const github = 'github/github.html';
    const drive = 'drive/drive.html';
    const cloud = 'cloud/cloud.html';
    const milestones = 'milestones/milestones.html';
    const tasks = 'tasks/tasks.html';
    const userOverview = 'users/narrow/overview.html';
    const projectOverview = 'projects/narrow/overview.html';
    const profile = 'profile/profile.html';

    // Misc Templates
    const error404 = 'misc/404.html';

    const defaultRoute = '/app/dashboard';
    $urlRouterProvider.when('/', defaultRoute);
    $urlRouterProvider.otherwise('/404');

    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          '': {
            templateUrl: appLayout
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: dashboard,
        data: {
          title: 'Collab Dashboard'
        },
        controller: 'dashboardCtrl',
        controllerAs: 'vm',
        resolve: load(['dashboard/dashboard.controller.js'])
      })
      .state('app.projects', {
        url: '/projects',
        templateUrl: projects,
        data: {
          title: 'Projects'
        },
        controller: 'projectsCtrl',
        controllerAs: 'vm',
        resolve: load(['projects/global/projects.controller.js'])
      })
      .state('app.users', {
        url: '/users',
        templateUrl: users,
        data: {
          title: 'Users'
        },
        controller: 'usersCtrl',
        controllerAs: 'vm',
        resolve: load(['users/global/users.controller.js'])
      })
      .state('app.github', {
        url: '/github',
        templateUrl: github,
        data: {
          title: 'GitHub'
        },
        controller: 'githubCtrl',
        controllerAs: 'vm',
        resolve: load(['github/github.controller.js'])
      })
      .state('app.drive', {
        url: '/drive',
        templateUrl: drive,
        data: {
          title: 'Google Drive'
        },
        controller: 'driveCtrl',
        controllerAs: 'vm',
        resolve: load(['drive/drive.controller.js'])
      })
      .state('app.cloud', {
        url: '/cloud',
        templateUrl: cloud,
        data: {
          title: 'Cloud IDE'
        },
        controller: 'cloudCtrl',
        controllerAs: 'vm',
        resolve: load(['cloud/cloud.controller.js'])
      })
      .state('app.tasks', {
        url: '/tasks',
        templateUrl: tasks,
        data: {
          title: 'Tasks'
        },
        controller: 'tasksCtrl',
        controllerAs: 'vm',
        resolve: load(['tasks/tasks.controller.js'])
      })
      .state('app.milestones', {
        url: '/milestones',
        templateUrl: milestones,
        data: {
          title: 'Milestones'
        },
        controller: 'milestonesCtrl',
        controllerAs: 'vm',
        resolve: load(['milestones/milestones.controller.js'])
      })
      .state('app.user', {
        url: '/user',
        templateUrl: userOverview,
        data: {
          title: 'User Overview: Hooi Tong'
        },
        controller: 'userOverviewCtrl',
        controllerAs: 'vm',
        resolve: load(['users/narrow/overview.controller.js'])
      })
      .state('app.project', {
        url: '/project',
        templateUrl: projectOverview,
        data: {
          title: 'Project Overview: Project Gene'
        },
        controller: 'projectOverviewCtrl',
        controllerAs: 'vm',
        resolve: load(['projects/narrow/overview.controller.js'])
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: profile,
        data: {
          title: 'Your Profile'
        },
        controller: 'profileCtrl',
        controllerAs: 'vm',
        resolve: load(['profile/profile.controller.js'])
      })
      .state('auth', {
        abstract: true,
        url: '/auth',
        views: {
          '': {
            templateUrl: authLayout
          }
        }
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: login,
        controller: 'loginCtrl',
        controllerAs: 'vm',
        resolve: load(['authentication/login.controller.js'])
      })
      .state('404', {
        url: '/404',
        templateUrl: error404
      });

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
          }
        ]
      };
    }
  }
})();
