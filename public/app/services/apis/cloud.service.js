/**
 * Service Factory that creates object that represent HTTP services
 * for /api/global/cloud Resources
 * @namespace CloudFactory
 */

(() => {
  angular
    .module('app')
    .factory('Cloud', cloudFactory);

  cloudFactory.$inject = ['$http'];

  function cloudFactory($http) {
    const urlBase = '/api/global/cloud';
    const cloudFactory = {};

    cloudFactory.getOverview = (range) => {
      return $http.get(`${urlBase}/overview?range=${range}`);
    };

    return cloudFactory;
  }
})();
