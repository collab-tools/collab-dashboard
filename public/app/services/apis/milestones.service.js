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

    milestonesFactory.getMilestones = (elapsed, start, end) => {
      return $http.get(`${urlBase}?elapsed=${elapsed}&start=${start}&end=${end}`);
    };

    milestonesFactory.getMilestone = (milestoneId) => {
      return $http.get(`${urlBase}/${milestoneId}`);
    };

    milestonesFactory.getActivities = (start, end) => {
      return $http.get(`${urlBase}/activities?start=${start}&end=${end}`);
    };

    milestonesFactory.getMilestoneActivities = (milestoneId, start, end) => {
      return $http.get(`${urlBase}/${milestoneId}/activities?start=${start}&end=${end}`);
    };

    milestonesFactory.getTasksByMilestones = (start, end) => {
      return $http.get(`${urlBase}/tasks?start=${start}&end=${end}`);
    };

    milestonesFactory.getParticipatingUsers = (start, end) => {
      return $http.get(`${urlBase}/users?start=${start}&end=${end}`);
    };

    return milestonesFactory;
  }
})();
