module.exports = function (sequelize, DataTypes) {
  return sequelize.define('task_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    filename: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING,
    taskId: DataTypes.STRING
  }, {
    underscored: true
  });
};
