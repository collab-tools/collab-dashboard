(() => {
  angular
    .module('app')
    .factory('Cloud', ($http) => {
      const urlBase = '/api/global/cloud';
      const cloudFactory = {};

      cloudFactory.getOverview = (range) => {
        return $http.get(`${urlBase}/overview?range=${range}`);
      };

      return cloudFactory;
    });
})();
