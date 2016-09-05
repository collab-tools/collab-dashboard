(() => {
  angular
    .module('authService')
    .factory('Auth', ($http, $q, AuthToken) => {
      const urlBase = '/api/admin';
      const authFactory = {};

      authFactory.login = (username, password) => {
        return $http.post(`${urlBase}/authenticate`, { username, password })
          .success((payload) => {
            AuthToken.setToken(payload.token);
            return payload;
          });
      };

      authFactory.logout = () => {
        AuthToken.setToken();
      };

      authFactory.isLoggedIn = () => {
        return !!AuthToken.getToken();
      };

      authFactory.getUser = () => {
        if (AuthToken.getToken()) {
          return $http.get(`${urlBase}/profile`);
        }
        return $q.reject({
          message: 'User not logged in / have no token.'
        });
      };

      return authFactory;
    })
    .factory('AuthToken', ($window) => {
      const authTokenFactory = {};
      authTokenFactory.getToken = () => {
        return $window.localStorage.getItem('token');
      };

      authTokenFactory.setToken = (token) => {
        if (token) {
          $window.localStorage.setItem('token', token);
        } else {
          $window.localStorage.removeItem('token');
        }
      };

      return authTokenFactory;
    })
    .factory('AuthInterceptor', ($q, $location, AuthToken) => {
      const interceptorFactory = {};

      interceptorFactory.request = (config) => {
        const token = AuthToken.getToken();
        if (token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      };

      interceptorFactory.responseError = (res) => {
        if (res.status === 403) {
          $location.path('/auth/login');
        }

        return $q.reject(res);
      };
    });
})();
