'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('drive_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    fileName: DataTypes.STRING,
    fileUUID: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getUniqueFiles(projectId, range) {
        const where = { projectId, date: { $gt: range } };
        return this.findAll({
          where,
          attributes: [
            [sequelize.literal('DISTINCT `fileUUID`'), 'fileUUID'], 'fileName', 'activity',
            'date', 'userId', 'projectId', 'id'
          ]
        });
      }
    }
  });
};
