import moment from 'moment';

module.exports = {
  google: {
    mime: {
      audio: 'application/vnd.google-apps.audio',
      document: 'application/vnd.google-apps.document',
      drawing: 'application/vnd.google-apps.drawing',
      file: 'application/vnd.google-apps.file',
      folder: 'application/vnd.google-apps.folder',
      form: 'application/vnd.google-apps.form',
      fusiontable: 'application/vnd.google-apps.fusiontable',
      map: 'application/vnd.google-apps.map',
      photo: 'application/vnd.google-apps.photo',
      presentation: 'application/vnd.google-apps.presentation',
      script: 'application/vnd.google-apps.script',
      sites: 'application/vnd.google-apps.sites',
      spreadsheet: 'application/vnd.google-apps.spreadsheet',
      unknown: 'application/vnd.google-apps.unknown',
      video: 'application/vnd.google-apps.video'
    }
  },
  defaults: {
    startDate: 0,
    endDate: moment().valueOf(),
    jwtExpiry: 7
  },
  templates: {
    error: {
      badRequest: 'Unable to serve your content. Check your arguments.',
      missingParam: 'is a required parameter in GET request.',
      unauthorized: 'Unauthorized Access. Check your credentials',
      invalidData: 'contains the wrong data type as expected.',
      invalidRange: 'Invalid date range has been provided.'
    }
  }
};
