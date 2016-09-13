(() => {
  angular
    .module('app')
    .factory('AuthToken', authTokenFactory)
    .factory('Auth', authFactory)
    .factory('AuthInterceptor', authInterceptorFactory);

  authFactory.$inject = ['$window', '$http', 'AuthToken'];

  function authFactory($window, $http, AuthToken) {
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
        });
    };

    const logout = () => {
      AuthToken.deleteToken();
    };

    const currentUser = () => {
      if (isLoggedIn()) {
        const token = AuthToken.getToken();
        const payload = angular.fromJson($window.atob(token.split('.')[1]));
        return {
          name: payload.name,
          role: payload.role
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
