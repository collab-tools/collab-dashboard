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

    driveFactory.getFiles = (start, end) => {
      return $http.get(`${urlBase}/files?start=${start}&end=${end}`);
    };

    driveFactory.getFile = (fileId) => {
      return $http.get(`${urlBase}/files/${fileId}`);
    };

    driveFactory.getChanges = (start, end) => {
      return $http.get(`${urlBase}/files/changes?start=${start}&end=${end}`);
    };

    driveFactory.getFileChanges = (fileId, start, end) => {
      return $http.get(`${urlBase}/files/${fileId}/changes?start=${start}&end=${end}`);
    };

    driveFactory.getActivities = (start, end) => {
      return $http.get(`${urlBase}/files/activities?start=${start}&end=${end}`);
    };

    driveFactory.getFileActivities = (fileId, start, end) => {
      return $http.get(`${urlBase}/files/${fileId}/activities?start=${start}&end=${end}`);
    };

    driveFactory.getParticipatingUsers = (start, end) => {
      return $http.get(`${urlBase}/users?start=${start}&end=${end}`);
    };

    return driveFactory;
  }
})();
