(() => {
  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$window', '$log', 'Auth'];
  function loginCtrl($window, $log, auth) {
    const vm = this;
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
      auth.login(vm.credentials)
      .error((err) => {
        $log.error(err);
      })
      .then(() => {
        $window.location.href = vm.returnPage;
      });
    };
  }
})();
