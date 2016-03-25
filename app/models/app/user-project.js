module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_project', {
    role: DataTypes.STRING
  }, {
    underscored: true
  });
};
