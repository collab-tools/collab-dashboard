const _ = require('lodash');

// Convert sequelize database instances to JSON format for processing
function toJSON(instances) {
  return _.map(instances, (instance) => {
    return instance.toJSON();
  });
}

module.exports = () => {
  _.mixin({
    toJSON
  });
};
