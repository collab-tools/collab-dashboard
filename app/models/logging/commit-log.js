'use strict';

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
    underscored: true,
    classMethods: {
      getProjectCommits(projectId, range){
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getUserCommits(userId, projectId, range) {
        const where = { userId };
        if (projectId) where.projectId = projectId;
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getCommitsCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where });
      }
    }
  });
};
