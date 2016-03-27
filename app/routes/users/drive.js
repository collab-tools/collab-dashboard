'use strict';
const config = require('config');
const Promise = require('bluebird');
const google = require('googleapis');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

function getOverview(req, res) {
  const userId = req.query.userId;
  const projectId = req.query.projectId;
  if (!userId) return res.boom.badRequest(ERROR_BAD_REQUEST);
  if (!projectId) return res.boom.badRequest(ERROR_BAD_REQUEST);
  const dateRange = req.query.range || 7;
  if (!userId) return res.boom.badRequest(ERROR_BAD_REQUEST);

  const OAuth2 = google.auth.OAuth2;
  const oauthClient = new OAuth2(config.google_dev.client_id,
      config.google_dev.client_secret, config.google_dev.redirect_uris[0]);

  const retrieveInfo = () => {
    const dbInfo = {};
    return models.app.user.getUserById(userId)
        .then(user => {
          
        });
  };

  const recTraverseFolder = (folder) => {
    const options = {
      corpus: 'user',
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, mimeType)',
      q: `'${folder}' in parents`
    };

    return Promise.promisify(drive.files.list)(options)
        .then(response => {
          const children = [];
          response.files.forEach(file => {
            if (file.mimeType === FOLDER_MIME) children.push(recTraverseFolder(file.id));
          });
          return Promise
              .all(children.map(promise => {
                return promise.reflect();
              }))
              .then(() => {
                console.log('files done');
                payload.files = payload.files.concat(response.files);
              });
        });
  };

  const retrieveRevisions = () => {
    const Continue = {};
    const again = () => Continue;
    const repeat = fn => Promise.try(fn, again)
        .then(val => val === Continue && repeat(fn) || val);

    let start = 0;
    const stop = payload.files.length;
    return repeat(again => {
      if (start < stop) {
        const options = {
          fileId: payload.files[start].id,
          fields: 'kind, revisions'
        };
        return Promise.promisify(drive.revisions.list)(options)
            .then((revisions) => {
              payload.revisions = payload.revisions.concat(revisions);
            }, () => {
            })
            .then(() => ++start)
            .then(again);
      }
    });
  };

  return recTraverseFolder(rootFolder)
      .then(retrieveRevisions)
      .then(() => {
        payload.success = true;
        res.json(payload);
      })
      .catch(err => {
        console.error(err);
        res.boom.badRequest(ERROR_BAD_REQUEST);
      });
}


function getRevisions(req, res) {

}

function getRevisionCount(req, res) {

}

function getFiles(req, res) {

}

function getFileCount(req, res) {

}

function oauth(req, res) {
  const OAuth2 = google.auth.OAuth2;
  const oauthClient = new OAuth2(config.google_dev.client_id,
      config.google_dev.client_secret, config.google_dev.redirect_uris[0]);
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];
  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.json({ success: true, url });
}

function oauthCallback(req, res) {
  const OAuth2 = google.auth.OAuth2;
  const oauthClient = new OAuth2(config.google_dev.client_id,
      config.google_dev.client_secret, config.google_dev.redirect_uris[0]);
  if (req.query.code) {
    oauthClient.getToken(req.query.code, (err, test) => {
      console.log(test);
      res.json({ success: true });
    });
  } else res.boom.badRequest(ERROR_BAD_REQUEST);
}

const driveAPI = {
  getOverview, getRevisions, getRevisionCount,
  getFiles, getFileCount, oauth, oauthCallback
};

export default driveAPI;
