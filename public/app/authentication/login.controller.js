(() => {
  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  function loginCtrl($auth, $log) {
    const vm = this;
    vm.handleLoginBtnClick = () => {
      $auth.submitLogin(vm.loginForm)
        .then((res) => {
          $log.log(res);
        })
        .catch((res) => {
          $log.error(res);
        });
    };
  }
})();
