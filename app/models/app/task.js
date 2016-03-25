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
    underscored: true,
    classMethods: {
      isExist(id) {
        return this.findById(id).then(instance => instance !== null);
      },
      getTask(id) {
        return this.findById(id);
      }
    }
  });
};
