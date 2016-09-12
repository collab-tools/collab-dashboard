(() => {
  angular
    .module('app')
    .factory('Auth', authFactory)
    .factory('AuthInterceptor, authInterceptorFactory');

  authFactory.$inject = ['$window', '$localStorage', '$sessionStorage', '$http'];

  function authFactory($window, $localStorage, $sessionStorage, $http) {
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

    const isLoggedIn = () => {
      const token = getToken();
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
          saveToken(data.token, isLocal);
        });
    };

    const logout = () => {
      delete $localStorage['auth-token'];
      delete $sessionStorage['auth-token'];
    };

    const currentUser = () => {
      if (isLoggedIn()) {
        const token = getToken();
        const payload = angular.fromJson($window.atob(token.split('.')[1]));
        return {
          name: payload.name,
          role: payload.role
        };
      }

      return null;
    };

    return {
      saveToken,
      getToken,
      isLoggedIn,
      login,
      logout,
      currentUser
    };
  }

  authInterceptorFactory.$inject = ['$q', '$location', 'Auth'];

  function authInterceptorFactory($q, $location, Auth) {
    const request = (config) => {
      const token = Auth.getToken();
      config.headers = config.headers || {};
      if (token) {
        config.headers.Authorization = `Bearer: ${token}`;
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
