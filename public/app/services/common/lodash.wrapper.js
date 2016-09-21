(() => {
  angular
    .module('lodash', [])
    .factory('_', lodashFactory);

  lodashFactory.$inject = ['$window'];

  function lodashFactory($window) {
    return $window._;
  }
})();
