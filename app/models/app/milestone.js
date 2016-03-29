'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('milestones', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    github_id: DataTypes.BIGINT,
    github_number: DataTypes.INTEGER
  }, {
    indexes: [
      {
        fields: ['content'],
        type: 'FULLTEXT'
      }
    ],
    underscored: true,
    classMethods: {
      isExist(id) {
        return this.findById(id).then(instance => instance !== null);
      },
      getMilestone(id) {
        return this.findById(id);
      },
      getMilestonesByProject(projectId, range) {
        const where = { projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      }
    }
  });
};
