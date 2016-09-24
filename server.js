// Packages & Dependencies
// ====================================================
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from 'config';
import boom from 'express-boom-2';
import validator from 'express-validator';
import winston from 'winston';
import winstonRotate from 'winston-daily-rotate-file';
import fs from 'fs';

require('./app/common/mixins')();

// App & Middleware Configurations
// ====================================================
// body parser to grab information from HTTP POST requests
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(boom());

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

// configure logger to use as default error handler
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'logs';
if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }
winston.remove(winston.transports.Console);

// default transport for console with timestamp and color coding
winston.add(winston.transports.Console, {
  timestamp: tsFormat,
  colorize: true
});

// file transport for debug messages
winston.add(winstonRotate, {
  name: 'debug-transport',
  filename: `${logDir}/debug.log`,
  timestamp: tsFormat,
  level: 'debug'
});

// file transport for system messages
winston.add(winstonRotate, {
  name: 'system-transport',
  filename: `${logDir}/system.log`,
  timestamp: tsFormat,
  level: 'info'
});

winston.info('Debugging tool initialized.');

// serve front-end static assets and angular application
app.use(express.static(`${__dirname}/public/dist/app`));
app.use('/assets', express.static(`${__dirname}/public/dist/assets`));
app.use('/libs', express.static(`${__dirname}/public/libs`));

// API Routes
// =====================================================
require('./app/routes')(app, express);

// Catch-All Routing - Sends user to front-end
// =====================================================
app.all('*', (req, res) => {
  res.sendFile(`${__dirname}/public/dist/app/index.html`);
});

app.listen(config.get('port'));
winston.info(`Server Port opened at ${config.port}`);
