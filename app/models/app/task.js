'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tasks', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    completed_on: DataTypes.DATE,
    github_id: DataTypes.BIGINT,
    github_number: DataTypes.INTEGER,
    assignee_id: DataTypes.STRING
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
      getTask(id) {
        return this.findById(id);
      },
      getTasksByAssignee(userId, projectId, range) {
        const where = { assignee_id: userId, createdAt: { $gt: range } };
        if (projectId) where.project_id = projectId;
        return this.findAll({ where });
      },
      getTasksByProject(projectId, range) {
        const where = { projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getTasks(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      }
    }
  });
};
