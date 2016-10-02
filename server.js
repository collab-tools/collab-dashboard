// Packages & Dependencies
// ====================================================
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import config from 'config';
import boom from 'boom';
import validator from 'express-validator';
import winston from 'winston';
import winstonRotate from 'winston-daily-rotate-file';
import fs from 'fs';

const app = express();
const isProduction = app.get('env') === 'production';
const rootApp = isProduction ? `${__dirname}/dist` : `${__dirname}/app`;
const rootPublic = isProduction ? `${__dirname}/public/dist` : `${__dirname}/public`;
const rootLogging = `${__dirname}/logs`;

// eslint-disable-next-line import/no-dynamic-require
require(`${rootApp}/common/mixins`)();

// App & Middleware Configurations
// ====================================================
// body parser to grab information from HTTP POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all API requests to console
app.use(morgan('dev'));

// compress all endpoint routes
app.use(compression());

// enable validator middle-ware for endpoints
app.use(validator());

// further secure by modifying various http headers
app.use(helmet());

// middleware to protect against HTTP parameter pollution attacks
app.use(hpp());

// serve front-end static assets and angular application
app.use(express.static(`${rootPublic}/app`));
app.use('/assets', express.static(`${rootPublic}/assets`));
app.use('/libs', express.static(`${rootPublic}/libs`));

// API Routes
// =====================================================\
// eslint-disable-next-line import/no-dynamic-require
require(`${rootApp}/routes`)(app, express);

// Catch-All Routing - Sends user to front-end
// =====================================================
app.all('*', (req, res) => {
  res.sendFile(`${rootPublic}/app/index.html`);
});

// configure logger to use as default error handler
const tsFormat = () => (new Date()).toLocaleTimeString();
if (!fs.existsSync(rootLogging)) { fs.mkdirSync(rootLogging); }
winston.remove(winston.transports.Console);

// default transport for console with timestamp and color coding
winston.add(winston.transports.Console, {
  prettyPrint: true,
  timestamp: tsFormat,
  colorize: true,
  level: 'debug'
});

// file transport for debug messages
winston.add(winstonRotate, {
  name: 'debug-transport',
  filename: `${rootLogging}/debug.log`,
  timestamp: tsFormat,
  level: 'debug'
});

// file transport for system messages
winston.add(winstonRotate, {
  name: 'system-transport',
  filename: `${rootLogging}/system.log`,
  timestamp: tsFormat,
  level: 'info'
});

winston.info('Debugging tool initialized.');

// configure express error handler middleware
const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const logErrors = (err, req, res, next) => {
  if (err.isBoom) {
    winston.debug(`Status Code: ${err.output.statusCode} | ${err.stack}`, err.data);
    next(err);
  } else {
    winston.error(err);
    next(boom.badRequest(ERROR_BAD_REQUEST));
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.output.statusCode).json(err.output.payload);
};

app.use(logErrors);
app.use(errorHandler);

app.listen(config.get('port'));
winston.info(`Server Port opened at ${config.port}`);
