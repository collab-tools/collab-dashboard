'use strict';

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
    underscored: true,
    classMethods: {
      getByUserId(userId) {
        const where = { userId };
        return this.findAll(where);
      },
      // range is optional.
      getByUserProject(userId, projectId, range) {
        const where = !range ? { userId, projectId } : { userId, projectId, date: { $gt: range } };
        return this.findAll(where);
      }
    }
  });
};

/* Activity
 1. Created
 2. Updated
 */