(() => {
  angular
    .module('app')
    .factory('Auth', authFactory);

  authFactory.$inject = ['$window', '$http'];

  function authFactory($window, $http) {
    const saveToken = (token) => {
      $window.localStorage['auth-token'] = token;
    };

    const getToken = () => {
      return $window.localStorage['auth-token'];
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

    const login = (user) => {
      return $http.post('/api/admin/authenticate', user)
        .success((data) => {
          saveToken(data.token);
        });
    };

    const logout = () => {
      $window.localStorage.removeItem('auth-token');
    };

    const currentUser = () => {
      if (isLoggedIn()) {
        const token = getToken();
        const payload = angular.fromJson($window.atob(token.split('.')[1]));
        return {
          name: payload.name
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
})();
