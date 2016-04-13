(() => {
  'use strict';
  
  angular
    .module('ui.load', [])
    .service('uiLoad', uiLoad);

  uiLoad.$inject = ['$document', '$q', '$timeout'];
  function uiLoad($document, $q, $timeout) {

    const loaded = [];
    let promise = false;
    const deferred = $q.defer();

    /**
     * Chain loads the given sources
     * @param srcs array, script or css
     * @returns {*} Promise that will be resolved once the sources has been loaded.
     */
    this.load = function (srcs) {
      srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
      const self = this;
      if (!promise) {
        promise = deferred.promise;
      }
      angular.forEach(srcs, (src) => {
        promise = promise.then(() => {
          return src.indexOf('.css') >= 0 ? self.loadCSS(src) : self.loadScript(src);
        });
      });
      deferred.resolve();
      return promise;
    };

    /**
     * Dynamically loads the given script
     * @param src The url of the script to load dynamically
     * @returns {*} Promise that will be resolved once the script has been loaded.
     */
    this.loadScript = function (src) {
      if (loaded[src]) return loaded[src].promise;

      const deferred = $q.defer();
      const script = $document[0].createElement('script');
      script.src = src;
      script.onload = (e) => {
        $timeout(() => {
          deferred.resolve(e);
        });
      };
      script.onerror = (e) => {
        $timeout(() => {
          deferred.reject(e);
        });
      };
      $document[0].body.appendChild(script);
      loaded[src] = deferred;

      return deferred.promise;
    };

    /**
     * Dynamically loads the given CSS file
     * @param href The url of the CSS to load dynamically
     * @returns {*} Promise that will be resolved once the CSS file has been loaded.
     */
    this.loadCSS = function (href) {
      if (loaded[href]) return loaded[href].promise;

      const deferred = $q.defer();
      const style = $document[0].createElement('link');
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.href = href;
      style.onload = (e) => {
        $timeout(() => {
          deferred.resolve(e);
        });
      };
      style.onerror = (e) => {
        $timeout(() => {
          deferred.reject(e);
        });
      };
      $document[0].head.appendChild(style);
      loaded[href] = deferred;

      return deferred.promise;
    };
  }
})();
