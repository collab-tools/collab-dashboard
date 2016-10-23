/**
 * Service Factory that creates object that represent HTTP services
 * for /api/global/drive Resources.
 * @namespace DriveFactory
 */

(() => {
  angular
    .module('app')
    .factory('Drive', driveFactory);

  driveFactory.$inject = ['$http'];

  function driveFactory($http) {
    const urlBase = '/api/global/drive';
    const driveFactory = {};

    driveFactory.getFiles = (range) => {
      return $http.get(`${urlBase}/files?range=${range}`);
    };

    driveFactory.getFile = (fileId) => {
      return $http.get(`${urlBase}/files/${fileId}`);
    };

    driveFactory.getChanges = (range) => {
      return $http.get(`${urlBase}/changes?range=${range}`);
    };

    driveFactory.getFileChanges = (fileId, range) => {
      return $http.get(`${urlBase}/files/${fileId}/changes?range=${range}`);
    };

    driveFactory.getParticipatingUsers = (range) => {
      return $http.get(`${urlBase}/users?range=${range}`);
    };

    return driveFactory;
  }
})();
