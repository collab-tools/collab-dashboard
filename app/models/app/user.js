module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    google_id: DataTypes.STRING,
    email: DataTypes.STRING,
    google_token: DataTypes.STRING,
    github_token: DataTypes.STRING,
    display_name: DataTypes.STRING,
    display_image: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      isExist(email) {
        return this.find({
          where: { email }
        }).then(instance => instance !== null);
      },
      getUserById(id) {
        return this.findById(id);
      }
    }
  });
};
