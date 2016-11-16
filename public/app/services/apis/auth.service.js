/**
 * Service Factory that creates object that represent HTTP services
 * for /api/admin Resources
 * @namespace AuthTokenFactory
 * @namespace AuthFactory
 *
 * Service Factory that creates object which intercepts HTTP methods
 * and attach JWT token information for authenticating API calls.
 * @namespace AuthInterceptorFactory
 */

(() => {
  angular
    .module('app')
    .factory('AuthToken', authTokenFactory)
    .factory('Settings', settingsFactory)
    .factory('Auth', authFactory)
    .factory('AuthInterceptor', authInterceptorFactory);


  authFactory.$inject = ['$window', '$http', 'AuthToken', 'Settings'];

  function authFactory($window, $http, AuthToken, Settings) {
    const isLoggedIn = () => {
      const token = AuthToken.getToken();
      if (token) {
        const payload = angular.fromJson($window.atob(token.split('.')[1]));
        // check if token is expired
        return payload.exp > Date.now() / 1000;
      }
      return false;
    };

    const login = (user, isLocal) => {
      return $http.post('/api/admin/authenticate', user)
        .success((data) => {
          AuthToken.saveToken(data.token, isLocal);
          Settings.saveSettings(data.settings, isLocal);
        });
    };

    const logout = () => {
      AuthToken.deleteToken();
      Settings.deleteSettings();
    };

    const currentUser = () => {
      if (isLoggedIn()) {
        const token = AuthToken.getToken();
        const settings = angular.fromJson(Settings.getSettings());
        const payload = angular.fromJson($window.atob(token.split('.')[1]));
        return {
          name: payload.name,
          username: payload.username,
          role: payload.role,
          settings
        };
      }

      return null;
    };

    return {
      isLoggedIn,
      login,
      logout,
      currentUser
    };
  }

  authTokenFactory.$inject = ['$localStorage', '$sessionStorage'];

  function authTokenFactory($localStorage, $sessionStorage) {
    const saveToken = (token, isLocal) => {
      if (isLocal) {
        $localStorage['auth-token'] = token;
      } else {
        $sessionStorage['auth-token'] = token;
      }
    };

    const getToken = () => {
      return $localStorage['auth-token'] || $sessionStorage['auth-token'];
    };

    const deleteToken = () => {
      delete $localStorage['auth-token'];
      delete $sessionStorage['auth-token'];
    };

    return {
      saveToken,
      getToken,
      deleteToken
    };
  }

  settingsFactory.$inject = ['$localStorage', '$sessionStorage'];

  function settingsFactory($localStorage, $sessionStorage) {
    const saveSettings = (settings, isLocal) => {
      if (isLocal) {
        $localStorage.settings = settings;
      } else {
        $sessionStorage.settings = settings;
      }
    };

    const getSettings = () => {
      return $localStorage.settings || $sessionStorage.settings;
    };

    const deleteSettings = () => {
      delete $localStorage.settings;
      delete $sessionStorage.settings;
    };

    return {
      saveSettings,
      getSettings,
      deleteSettings
    };
  }

  authInterceptorFactory.$inject = ['$q', '$location', 'AuthToken'];

  function authInterceptorFactory($q, $location, AuthToken) {
    const request = (config) => {
      const token = AuthToken.getToken();
      config.headers = config.headers || {};
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    };

    const responseError = (response) => {
      if (response.status === 403 || response.status === 401) {
        $location.path('/auth/login');
      }

      return $q.reject(response);
    };

    return {
      request,
      responseError
    };
  }
})();
