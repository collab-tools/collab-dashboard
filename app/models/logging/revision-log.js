module.exports = function (sequelize, DataTypes) {
  return sequelize.define('revision_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fileUUID: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true
  });
};
