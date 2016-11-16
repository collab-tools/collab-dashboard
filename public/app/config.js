(() => {
  angular
    .module('app')
    .constant('googleMIME', {
      'application/vnd.google-apps.audio': 'Audio',
      'application/vnd.google-apps.document': 'Document',
      'application/vnd.google-apps.drawing': 'Drawing',
      'application/vnd.google-apps.file': 'File',
      'application/vnd.google-apps.folder': 'Folder',
      'application/vnd.google-apps.form': 'Form',
      'application/vnd.google-apps.fusiontable': 'FusionTable',
      'application/vnd.google-apps.map': 'Map',
      'application/vnd.google-apps.photo': 'Photo',
      'application/vnd.google-apps.presentation': 'Presentation',
      'application/vnd.google-apps.script': 'Script',
      'application/vnd.google-apps.sites': 'Sites',
      'application/vnd.google-apps.spreadsheet': 'Spreadsheet',
      'application/vnd.google-apps.unknown': 'Unknown',
      'application/vnd.google-apps.video': 'Video'
    })
    .config(config);

  config.$inject = ['$locationProvider', '$httpProvider'];

  function config($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
  }
})();
