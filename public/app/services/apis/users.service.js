(() => {
  'use strict';
  angular
    .module('app')
    .factory('Users', ($resource) => {
      const urlBase = '/api/users/';
      const usersFactory = {};
      return usersFactory;
    });
})();
