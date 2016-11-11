/**
 * Service Factory that creates object that represent HTTP services
 * for /api/admin Resources.
 * @namespace adminFactory
 */

(() => {
  angular
    .module('app')
    .factory('Admin', adminFactory);

  adminFactory.$inject = ['$http'];

  function adminFactory($http) {
    const urlBase = '/api/admin';
    const adminFactory = {};

    adminFactory.createAdmin = (admin) => {
      return $http.post(urlBase, admin);
    };

    adminFactory.updateAdmin = (admin) => {
      return $http.put(urlBase, admin);
    };

    return adminFactory;
  }
})();
