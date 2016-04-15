(() => {
  'use strict';
  angular
    .module('app')
    .factory('Projects', ($resource) => {
      const urlBase = '/api/projects/';
      const projectsFactory = {};
      return projectsFactory;
    });
})();
