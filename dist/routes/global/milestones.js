'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _storageHelper = require('../../common/storage-helper');

var _storageHelper2 = _interopRequireDefault(_storageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models = new _storageHelper2.default();

var ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
var ERROR_MISSING_TEMPLATE = 'is a required parameter in GET request.';

function getOverview(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var response = function response(data) {
    if (_lodash2.default.isNil(data)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json({ count: data.count, activities: data.rows });
  };

  return models.log.milestone_log.getByRange(convertedRange).then(response).catch(next);
}

function getMilestones(req, res, next) {
  req.query.range = req.query.range || 7;
  req.checkQuery('range', 'range ' + ERROR_MISSING_TEMPLATE).isInt();
  if (_lodash2.default.isUndefined(req.query.count)) req.checkQuery('count', ERROR_BAD_REQUEST).isBoolean();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var dateRange = req.query.range;
  var convertedRange = (0, _moment2.default)(new Date()).subtract(dateRange, 'day').format('YYYY-MM-DD HH:mm:ss');
  var evalQuery = function evalQuery() {
    if (req.query.count) return models.app.milestone.getCount(convertedRange);
    return models.app.milestone.getMilestones(convertedRange);
  };
  var response = function response(data) {
    if (_lodash2.default.isNil(data)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    var payload = req.query.count ? { count: data } : { milestones: data };
    res.status(200).json(payload);
  };

  return evalQuery().then(response).catch(next);
}

function getMilestone(req, res, next) {
  req.checkParams('milestoneId', 'milestoneId ' + ERROR_MISSING_TEMPLATE).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(_boom2.default.badRequest(errors));

  var milestoneId = req.params.milestoneId;
  var response = function response(milestone) {
    if (_lodash2.default.isNil(milestone)) return next(_boom2.default.badRequest(ERROR_BAD_REQUEST));
    res.status(200).json(milestone);
  };

  return models.app.milestone.getMilestone(milestoneId).then(response).catch(next);
}

var milestonesAPI = {
  getOverview: getOverview,
  getMilestones: getMilestones,
  getMilestone: getMilestone
};

exports.default = milestonesAPI;