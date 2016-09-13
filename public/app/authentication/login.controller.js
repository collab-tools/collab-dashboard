(() => {
  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$window', '$log', 'Auth'];

  function loginCtrl($window, $log, auth) {
    const vm = this;

    // initialize default variables for the controller
    vm.isLocal = false;
    vm.hasError = false;
    vm.returnPage = '/app/dashboard';
    vm.credentials = {
      email: '',
      password: ''
    };

    vm.onSubmit = () => {
      if (!vm.credentials.username || !vm.credentials.password) {
        return false;
      }
      return vm.requestLogin();
    };

    vm.requestLogin = () => {
      // remove any error while attempting to login
      vm.hasError = false;

      $log.error(vm.isLocal);
      auth.login(vm.credentials, vm.isLocal)
        .error((err) => {
          // display error when authentication failed
          vm.hasError = true;
          $log.error(err);
        })
        .then(() => {
          $window.location.href = vm.returnPage;
        });
    };
  }
})();
