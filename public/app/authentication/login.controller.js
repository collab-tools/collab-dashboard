(() => {
  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  function loginCtrl($location, Auth) {
    const vm = this;

    vm.requestLogin = () => {
      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(() => {
          $location.path('/app/dashboard');
        });
    };

    vm.requestLogout = () => {
      Auth.logout();
      $location.path('/auth/login');
    };
  }
})();
