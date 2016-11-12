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

    githubFactory.getRepositories = (start, end) => {
      return $http.get(`${urlBase}/repos?start=${start}&end=${end}`);
    };

    githubFactory.getCommits = (start, end) => {
      return $http.get(`${urlBase}/commits?start=${start}&end=${end}`);
    };

    githubFactory.getCommit = (commitId) => {
      return $http.get(`${urlBase}/commits/${commitId}`);
    };

    githubFactory.getReleases = (start, end) => {
      return $http.get(`${urlBase}/releases?start=${start}&end=${end}`);
    };

    githubFactory.getRelease = (releaseId) => {
      return $http.get(`${urlBase}/release/${releaseId}`);
    };

    githubFactory.getParticipatingUsers = (start, end) => {
      return $http.get(`${urlBase}/users?start=${start}&end=${end}`);
    };

    githubFactory.getParticipatingProjects = (start, end) => {
      return $http.get(`${urlBase}/projects?start=${start}&end=${end}`);
    };

    githubFactory.downloadAssets = (releases) => {
      return $http.get(`${urlBase}/assets?releases=${releases}`, { responseType: 'arraybuffer' });
    };
    return githubFactory;
  }
})();
