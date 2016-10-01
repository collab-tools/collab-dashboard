(() => {
  angular
    .module('app')
    .factory('Milestones', milestonesFactory);

  milestonesFactory.$inject = ['$http'];

  function milestonesFactory($http) {
    const urlBase = '/api/global/milestones';
    const milestonesFactory = {};

    milestonesFactory.getOverview = (range) => {
      return $http.get(`${urlBase}/overview?range=${range}`);
    };

    milestonesFactory.getMilestones = (range) => {
      return $http.get(`${urlBase}?range=${range}&count=0`);
    };

    milestonesFactory.getCount = (range) => {
      return $http.get(`${urlBase}?range=${range}&count=1`);
    };

    milestonesFactory.getMilestone = (milestoneId) => {
      return $http.get(`${urlBase}/${milestoneId}`);
    };

    return milestonesFactory;
  }
})();
