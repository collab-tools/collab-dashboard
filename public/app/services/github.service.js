(() => {
  'use strict';
  angular
    .module('app')
    .factory('Github', ($resource) => {
      const urlBase = '/api/global/github';
      const githubFactory = {};
      return githubFactory;
    });
})();
