(() => {
  angular
    .module('app')
    .directive('uiToggleClass', uiToggleClass);

  uiToggleClass.$inject = ['$timeout', '$document'];
  function uiToggleClass($timeout, $document) {
    return {
      restrict: 'AC',
      link
    };

    function link(scope, el, attr) {
      el.on('click', (e) => {
        e.preventDefault();
        const classes = attr.uiToggleClass.split(',');
        const targets = (attr.uiTarget && attr.uiTarget.split(',')) ||
          (attr.target && attr.target.split(',')) || Array(el);
        let key = 0;

        angular.forEach(classes, (_class) => {
          const target = $(targets[(targets.length && key)]);
          const current = $(target).attr('ui-class');

          if (current !== _class) target.removeClass($(target).attr('ui-class'));
          target.toggleClass(_class);
          $(target).attr('ui-class', _class);
          key++;
        });
        el.toggleClass('active');
      });
    }
  }
})();
