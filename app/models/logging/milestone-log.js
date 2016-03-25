module.exports = function (sequelize, DataTypes) {
  return sequelize.define('milestone_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING,
    milestoneId: DataTypes.STRING
  }, {
    underscored: true
  });
};
