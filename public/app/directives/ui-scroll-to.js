(() => {
  'use strict';
  angular
    .module('app')
    .directive('uiScrollTo', uiScrollTo);

  uiScrollTo.$inject = ['$location', '$anchorScroll'];
  function uiScrollTo($location, $anchorScroll) {
    return {
      restrict: 'AC',
      replace: true,
      link
    };
    function link(scope, el, attr) {
      el.bind('click', (e) => {
        e.preventDefault();
        $location.hash(attr.uiScrollTo);
        $anchorScroll();
      });
    }
  }
})();
