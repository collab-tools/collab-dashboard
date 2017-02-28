'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var libConfig = {
  debug: true,
  protocol: 'https',
  Promise: _bluebird2.default
};

var github = new _github2.default(libConfig);
github.authenticate({
  type: 'oauth',
  key: _config2.default.get('github.client_id'),
  secret: _config2.default.get('github.client_secret')
});

exports.default = github;