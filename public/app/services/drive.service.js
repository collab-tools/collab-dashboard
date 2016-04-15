(() => {
  'use strict';
  angular
    .module('app')
    .factory('Drive', ($resource) => {
      const urlBase = '/api/global/drive';
      const driveFactory = {};
      return driveFactory;
    });
})();
