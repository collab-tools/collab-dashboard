/**
 * Service Factory that creates object that represent HTTP services
 * for /api/global/milestones Resources
 * @namespace MilestonesFactory
 */

(() => {
  angular
    .module('app')
    .factory('Milestones', milestonesFactory);

  milestonesFactory.$inject = ['$http'];

  function milestonesFactory($http) {
    const urlBase = '/api/global/milestones';
    const milestonesFactory = {};

    milestonesFactory.getMilestones = (range) => {
      return $http.get(`${urlBase}?range=${range}`);
    };

    milestonesFactory.getMilestone = (milestoneId) => {
      return $http.get(`${urlBase}/${milestoneId}`);
    };

    milestonesFactory.getActivities = (range) => {
      return $http.get(`${urlBase}/activities?range=${range}`);
    };

    milestonesFactory.getMilestoneActivities = (milestoneId, range) => {
      return $http.get(`${urlBase}/${milestoneId}/activities?range=${range}`);
    };

    milestonesFactory.getTasksByMilestones = (range) => {
      return $http.get(`${urlBase}/tasks?range=${range}`);
    };

    return milestonesFactory;
  }
})();
