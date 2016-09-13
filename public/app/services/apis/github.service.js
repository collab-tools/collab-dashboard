(() => {
  angular
    .module('app')
    .factory('Github', githubFactory);

  githubFactory.$inject = ['$http'];

  function githubFactory($http) {
    const urlBase = '/api/global/github';
    const githubFactory = {};

    githubFactory.getOverview = (range) => {
      return $http.get(`${urlBase}/overview?range=${range}`);
    };

    githubFactory.getCommit = (commitId) => {
      return $http.get(`${urlBase}/commits/${commitId}`);
    };

    githubFactory.getCommits = (range) => {
      return $http.get(`${urlBase}/commits?range=${range}`);
    };

    githubFactory.getRelease = (releaseId) => {
      return $http.get(`${urlBase}/release/${releaseId}`);
    };

    githubFactory.getReleases = (range) => {
      return $http.get(`${urlBase}/releases?range=${range}`);
    };

    return githubFactory;
  }
})();
