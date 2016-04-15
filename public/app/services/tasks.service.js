(() => {
  'use strict';
  angular
    .module('app')
    .factory('Tasks', ($resource) => {
      const urlBase = '/api/global/tasks';
      const tasksFactory = {};
      return tasksFactory;
    });
})();
