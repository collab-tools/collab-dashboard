(() => {
  'use strict';
  angular
    .module('app')
    .directive('uiInclude', uiInclude);
  uiInclude.$inject = ['$http', '$templateCache', '$compile'];
  function uiInclude($http, $templateCache, $compile) {
    return {
      restrict: 'A',
      link
    };

    function link(scope, el, attr) {
      const templateUrl = scope.$eval(attr.uiInclude);
      $http.get(templateUrl, { cache: $templateCache }).success(
        (tplContent) => {
          el.replaceWith($compile(tplContent)(scope));
        }
      );
    }
  }
})();
