(() => {
  'use strict';
  angular
    .module('app')
    .directive('uiNav', uiNav);
  function uiNav() {
    return { restrict: 'AC', link };
  }

  function link(scope, el, attr) {
    el.find('a').bind('click', function(e) {
      const li = angular.element(this).parent();
      const active = li.parent()[0].querySelectorAll('.active');
      li.toggleClass('active');
      angular.element(active).removeClass('active');
    });
  }
})();
