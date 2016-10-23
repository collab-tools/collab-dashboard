/**
 * Service Factory that creates object that represent HTTP services
 * for /api/global/github Resources.
 * @namespace GithubFactory
 */

(() => {
  angular
    .module('app')
    .factory('Github', githubFactory);

  githubFactory.$inject = ['$http'];

  function githubFactory($http) {
    const urlBase = '/api/global/github';
    const githubFactory = {};

    githubFactory.getRepositories = (range) => {
      return $http.get(`${urlBase}/repos?range=${range}`);
    };

    githubFactory.getCommits = (range) => {
      return $http.get(`${urlBase}/commits?range=${range}`);
    };

    githubFactory.getCommit = (commitId) => {
      return $http.get(`${urlBase}/commits/${commitId}`);
    };

    githubFactory.getReleases = (range) => {
      return $http.get(`${urlBase}/releases?range=${range}`);
    };

    githubFactory.getRelease = (releaseId) => {
      return $http.get(`${urlBase}/release/${releaseId}`);
    };

    githubFactory.getParticipatingUsers = (range) => {
      return $http.get(`${urlBase}/users?range=${range}`);
    };

    return githubFactory;
  }
})();
