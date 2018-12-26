(() => {
  angular
    .module("app")
    .run(runBlock)
    .config(config);

  runBlock.$inject = [
    "$rootScope",
    "$state",
    "$stateParams",
    "$location",
    "Auth"
  ];

  function runBlock($rootScope, $state, $stateParams, $location, auth) {
    const LOGIN_PATH = "/auth/login";
    const DEFAULT_PATH = "/app/dashboard";
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    /* eslint-disable */
    $rootScope.$on("$locationChangeStart", (event, next, current) => {
      if (!auth.isLoggedIn() && $location.path() !== LOGIN_PATH) {
        event.preventDefault();
        $location.path(LOGIN_PATH);
      } else if (auth.isLoggedIn() && $location.path() === LOGIN_PATH) {
        event.preventDefault();
        $location.path(DEFAULT_PATH);
      }
    });
    /* eslint-enable */
  }

  config.$inject = ["$stateProvider", "$urlRouterProvider", "MODULE_CONFIG"];

  function config($stateProvider, $urlRouterProvider, MODULE_CONFIG) {
    // Authentication Template
    const authLayout = "layout/layout.auth.html";
    const login = "authentication/login.html";

    // App Templates Relative Paths
    const appLayout = "layout/layout.html";
    const dashboard = "dashboard/dashboard.html";
    const projects = "projects/global/projects.html";
    const users = "users/global/users.html";
    const github = "github/github.html";
    const drive = "drive/drive.html";
    const cloud = "cloud/cloud.html";
    const milestones = "milestones/milestones.html";
    const tasks = "tasks/tasks.html";
    const userSummary = "users/narrow/summary.html";
    const projectSummary = "projects/narrow/summary.html";
    const settings = "settings/settings.html";

    // Misc Templates Relative Paths
    const error404 = "misc/404.html";

    const defaultRoute = "/app/dashboard";
    $urlRouterProvider.when("/", defaultRoute);
    $urlRouterProvider.otherwise("/404");

    $stateProvider
      .state("app", {
        abstract: true,
        url: "/app",
        views: {
          "": {
            templateUrl: appLayout
          }
        }
      })
      .state("app.dashboard", {
        url: "/dashboard",
        templateUrl: dashboard,
        data: { title: "Collab Dashboard" },
        controller: "dashboardCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "dashboard/dashboard.controller.js"])
      })
      .state("app.projects", {
        url: "/projects",
        templateUrl: projects,
        data: { title: "Projects" },
        controller: "projectsCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "projects/global/projects.controller.js"])
      })
      .state("app.project", {
        url: "/project/:projectId",
        templateUrl: projectSummary,
        data: { title: "Project: " },
        controller: "projectSummaryCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "projects/narrow/summary.controller.js"])
      })
      .state("app.users", {
        url: "/users",
        templateUrl: users,
        data: { title: "Users" },
        controller: "usersCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "users/global/users.controller.js"])
      })
      .state("app.user", {
        url: "/user/:userId",
        templateUrl: userSummary,
        data: { title: "User: " },
        controller: "userSummaryCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "users/narrow/summary.controller.js"])
      })
      .state("app.github", {
        url: "/github",
        templateUrl: github,
        data: { title: "GitHub" },
        controller: "githubCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "github/github.controller.js"])
      })
      .state("app.drive", {
        url: "/drive",
        templateUrl: drive,
        data: { title: "Google Drive" },
        controller: "driveCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "drive/drive.controller.js"])
      })
      .state("app.cloud", {
        url: "/cloud",
        templateUrl: cloud,
        data: { title: "Cloud IDE" },
        controller: "cloudCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "cloud/cloud.controller.js"])
      })
      .state("app.tasks", {
        url: "/tasks",
        templateUrl: tasks,
        data: { title: "Tasks" },
        controller: "tasksCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "tasks/tasks.controller.js"])
      })
      .state("app.milestones", {
        url: "/milestones",
        templateUrl: milestones,
        data: { title: "Milestones" },
        controller: "milestonesCtrl",
        controllerAs: "vm",
        resolve: load(["ui.select", "milestones/milestones.controller.js"])
      })
      .state("app.settings", {
        url: "/settings",
        templateUrl: settings,
        data: { title: "Settings" },
        controller: "settingsCtrl",
        controllerAs: "vm",
        resolve: load([
          "ui.select",
          "mgcrea.ngStrap",
          "sortable",
          "settings/settings.controller.js"
        ])
      })
      .state("auth", {
        abstract: true,
        url: "/auth",
        views: {
          "": {
            templateUrl: authLayout
          }
        }
      })
      .state("auth.login", {
        url: "/login",
        templateUrl: login,
        resolve: load(["ui.bootstrap"])
      })
      .state("404", {
        url: "/404",
        templateUrl: error404
      });

    function load(srcs, callback) {
      return {
        deps: [
          "$ocLazyLoad",
          "$q",
          function($ocLazyLoad, $q) {
            const deferred = $q.defer();
            let promise = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if (!promise) {
              promise = deferred.promise;
            }
            angular.forEach(srcs, src => {
              promise = promise.then(() => {
                angular.forEach(MODULE_CONFIG, module => {
                  if (module.name === src) {
                    src = module.module ? module.name : module.files;
                  }
                });
                return $ocLazyLoad.load(src);
              });
            });
            deferred.resolve();
            return callback
              ? promise.then(() => {
                  return callback();
                })
              : promise;
          }
        ]
      };
    }
  }
})();
