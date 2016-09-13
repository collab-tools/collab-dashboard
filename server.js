// Packages & Dependencies
// ====================================================
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('config');
const boom = require('express-boom-2');
const validator = require('express-validator');
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
console.log(`Server Port opened at ${config.port}`);
