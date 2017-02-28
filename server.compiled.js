'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _hpp = require('hpp');

var _hpp2 = _interopRequireDefault(_hpp);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); // Packages & Dependencies
// ====================================================

var isProduction = app.get('env') === 'production';
var rootApp = isProduction ? __dirname + '/dist' : __dirname + '/app';
var rootPublic = isProduction ? __dirname + '/public/dist' : __dirname + '/public';
var rootLogging = __dirname + '/logs';

// eslint-disable-next-line import/no-dynamic-require
require(rootApp + '/common/mixins')();

// App & Middleware Configurations
// ====================================================
// body parser to grab information from HTTP POST requests
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));
app.use(_bodyParser2.default.json());

// configure app to handle CORS requests
app.use((0, _cors2.default)());

// log all API requests to console
app.use((0, _morgan2.default)('dev'));

// compress all endpoint routes
app.use((0, _compression2.default)());

// enable validator middle-ware for endpoints
app.use((0, _expressValidator2.default)());

// further secure by modifying various http headers
app.use((0, _helmet2.default)());

// middleware to protect against HTTP parameter pollution attacks
app.use((0, _hpp2.default)());

// serve front-end static assets and angular application
app.use(_express2.default.static(rootPublic + '/app'));
app.use('/assets', _express2.default.static(rootPublic + '/assets'));
app.use('/libs', _express2.default.static(rootPublic + '/libs'));

// API Routes
// =====================================================\
// eslint-disable-next-line import/no-dynamic-require
require(rootApp + '/routes')(app, _express2.default);

// Catch-All Routing - Sends user to front-end
// =====================================================
app.all('*', function (req, res) {
  res.sendFile(rootPublic + '/app/index.html');
});

// configure logger to use as default error handler
var tsFormat = function tsFormat() {
  return new Date().toLocaleTimeString();
};
if (!_fs2.default.existsSync(rootLogging)) {
  _fs2.default.mkdirSync(rootLogging);
}
_winston2.default.remove(_winston2.default.transports.Console);

// default transport for console with timestamp and color coding
_winston2.default.add(_winston2.default.transports.Console, {
  prettyPrint: true,
  timestamp: tsFormat,
  colorize: true,
  level: 'debug'
});

// file transport for debug messages
_winston2.default.add(_winstonDailyRotateFile2.default, {
  name: 'debug-transport',
  filename: rootLogging + '/debug.log',
  timestamp: tsFormat,
  level: 'debug'
});

// file transport for system messages
_winston2.default.add(_winstonDailyRotateFile2.default, {
  name: 'system-transport',
  filename: rootLogging + '/system.log',
  timestamp: tsFormat,
  level: 'info'
});

_winston2.default.info('Debugging tool initialized.');

// configure express error handler middleware
var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var logErrors = function logErrors(err, req, res, next) {
  if (err.isBoom) {
    _winston2.default.debug('Status Code: ' + err.output.statusCode + ' | ' + err.stack, err.data);
    next(err);
  } else {
    _winston2.default.error(err);
    next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
  }
};

// eslint-disable-next-line no-unused-vars
var errorHandler = function errorHandler(err, req, res, next) {
  res.status(err.output.statusCode).json(err.output.payload);
};

app.use(logErrors);
app.use(errorHandler);

app.listen(_config2.default.get('port'));
_winston2.default.info('Server Port opened at ' + _config2.default.port);
