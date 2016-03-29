'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('revision_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fileUUID: DataTypes.STRING,
    fileName: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getFileRevisions(fileUUID, range) {
        const where = { fileUUID };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getProjectRevisions(projectId, fileUUID, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getUserRevisions(userId, fileUUID, range) {
        const where = { userId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getRevisionsCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where });
      }
    }
  });
};
