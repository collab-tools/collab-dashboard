'use strict';
const _ = require('lodash');
const config = require('config');
const Promise = require('bluebird');
const google = require('googleapis');
const models = require('../../models');

const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

function getOverview(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.checkQuery('projectId', ERROR_BAD_REQUEST).notEmpty();
  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range || 7;
  const OAuth2 = google.auth.OAuth2;
  const oauthClient = new OAuth2(config.google_dev.client_id,
      config.google_dev.client_secret, config.google_dev.redirect_uris[0]);
  const payload = { files: [], revisions: [] };

  const retrieveInfo = () => {
    return models.app.user.getUserById(userId)
        .then(user => {
          if (!user) return res.boom.badRequest(ERROR_BAD_REQUEST);
          return oauthClient.setCredentials({ refresh_token: user.google_token });
        })
        .then(() => {
          return models.app.project.findProjectById(projectId);
        })
        .then(project => {
          if (!project) return res.boom.badRequest(ERROR_BAD_REQUEST);
          return project.root_folder;
        });
  };

  const recTraverseFolder = (folder) => {
    const drive = google.drive({ version: 'v3', auth: oauthClient });
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
                payload.files = payload.files.concat(response.files);
              });
        });
  };

  const retrieveRevisions = () => {
    const drive = google.drive({ version: 'v3', auth: oauthClient });
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

  const response = () => {
    payload.success = true;
    res.json(payload);
  };

  return retrieveInfo()
      .then(recTraverseFolder)
      .then(retrieveRevisions)
      .then(response)
      .catch(err => {
        console.error(err);
        res.boom.badRequest(ERROR_BAD_REQUEST);
      });
}


function getRevisions(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.checkQuery('projectId', ERROR_BAD_REQUEST).notEmpty();
  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range || 7;
}

function getRevisionCount(req, res) {
  req.checkParams('userId', ERROR_BAD_REQUEST).notEmpty();
  req.checkQuery('projectId', ERROR_BAD_REQUEST).notEmpty();
  const userId = req.params.userId;
  const projectId = req.query.projectId;
  const dateRange = req.query.range || 7;
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
      res.json({ success: true });
    });
  } else res.boom.badRequest(ERROR_BAD_REQUEST);
}

const driveAPI = {
  getOverview, getRevisions, getRevisionCount,
  oauth, oauthCallback
};

export default driveAPI;
