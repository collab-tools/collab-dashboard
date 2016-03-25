module.exports = function (sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    root_folder: DataTypes.STRING,
    github_repo_name: DataTypes.STRING,
    github_repo_owner: DataTypes.STRING
  }, {
    underscored: true
  });
};
