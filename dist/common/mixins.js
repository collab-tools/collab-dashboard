'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Convert sequelize database instances to JSON format for processing
function toJSON(instances) {
  return _lodash2.default.map(instances, function (instance) {
    return instance.toJSON();
  });
}

module.exports = function () {
  _lodash2.default.mixin({
    toJSON: toJSON
  });
};