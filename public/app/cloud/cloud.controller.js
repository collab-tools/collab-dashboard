(() => {
  angular
    .module('app')
    .controller('cloudCtrl', cloudCtrl);

  function cloudCtrl() {
    const vm = this;

    vm.subtitle = 'Collab Statistics on IDE Usage';
  }
})();
