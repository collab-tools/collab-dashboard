(() => {
  angular
    .module('app')
    .factory('Drive', driveFactory);

  driveFactory.$inject = ['$http'];

  function driveFactory($http) {
    const urlBase = '/api/global/drive';
    const driveFactory = {};

    driveFactory.getOverview = (range) => {
      return $http.get(`${urlBase}/overview?range=${range}`);
    };

    driveFactory.getRevisions = (range) => {
      return $http.get(`${urlBase}/revisions?range=${range}`);
    };

    driveFactory.getFile = (fileId) => {
      return $http.get(`${urlBase}/files/${fileId}`);
    };

    driveFactory.getFileRevisions = (fileId, range) => {
      return $http.get(`${urlBase}/files/${fileId}/revisions?range=${range}`);
    };

    return driveFactory;
  }
})();
