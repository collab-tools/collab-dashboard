(() => {
  'use strict';
  angular
    .module('app')
    .factory('Milestones', ($http) => {
      const urlBase = '/api/global/milestones';
      const milestonesFactory = {};

      milestonesFactory.getOverview = (range) => {
        return $http.get(`${urlBase}/overview?range=${range}`);
      };

      milestonesFactory.getMilestone = (milestoneId) => {
        return $http.get(`${urlBase}/milestones/${milestoneId}`);
      };

      return milestonesFactory;
    });
})();
