(() => {
  angular
    .module('app')
    .directive('uiFullscreen', uiFullscreen);

  uiFullscreen.$inject = ['$ocLazyLoad', '$document'];

  function uiFullscreen($ocLazyLoad, $document) {
    const directive = { restrict: 'AC', link };
    return directive;

    function link(scope, el, attr) {
      el.addClass('hide');
      $ocLazyLoad.load('../libs/jquery/screenfull/dist/screenfull.min.js')
        .then(() => {
          if (screenfull.enabled) {
            el.removeClass('hide');
          } else {
            return;
          }
          el.bind('click', () => {
            let target;
            attr.target && (target = angular.element(attr.target)[0]);
            screenfull.toggle(target);
          });

          const body = angular.element($document[0].body);
          $document.on(screenfull.raw.fullscreenchange, function () {
            if (screenfull.isFullscreen) {
              body.addClass('fullscreen');
            } else {
              body.removeClass('fullscreen');
            }
          });
        });
    }
  }
})();
