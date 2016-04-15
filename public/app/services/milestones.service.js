(() => {
  'use strict';
  angular
    .module('app')
    .factory('Milestones', ($resource) => {
      const urlBase = '/api/global/milestones';
      const milestonesFactory = {};
      return milestonesFactory;
    });
})();
