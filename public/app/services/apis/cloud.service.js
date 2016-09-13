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
