(function() {
    'use strict';
    angular
      .module('app')
      .controller('AppCtrl', AppCtrl);

      AppCtrl.$inject  = ['$scope', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window'];

      function AppCtrl($scope, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window) {
        $scope.isIE = isIE();
        $scope.isMobile = isMobile();
        $scope.app = {
          name: 'Collab',
          version: '0.0.1',
          color: {
            'primary':      '#0cc2aa',
            'accent':       '#a88add',
            'warn':         '#fcc100',
            'info':         '#6887ff',
            'success':      '#6cc788',
            'warning':      '#f77a99',
            'danger':       '#f44455',
            'white':        '#ffffff',
            'light':        '#f1f2f3',
            'dark':         '#2e3e4e',
            'black':        '#2a2b3c'
          }
        };

        $rootScope.$on('$stateChangeSuccess', openPage);

        function openPage() {
          $location.hash('content');
          $anchorScroll();
          $location.hash('');
          $('#aside').modal('hide');
          $('body').removeClass('modal-open').find('.modal-backdrop').remove();
          $('.navbar-toggleable-sm').collapse('hide');
        };

        $scope.goBack = function () {
          $window.history.back();
        };

        function isIE() {
          return !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
        }

        function isMobile(){
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        function getParams(name) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
              results = regex.exec(location.search);
          return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
      }
})();
