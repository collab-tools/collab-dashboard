module.exports = function (sequelize, DataTypes) {
  return sequelize.define('commit_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    files: DataTypes.INTEGER,
    additions: DataTypes.INTEGER,
    deletions: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true
  });
};
