const bcrypt = require('bcrypt');
const saltRound = 8;

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_\-]+$/i
      }
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    underscored: true,
    instanceMethods: {
      comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
      updatePassword(password) {
        this.password = bcrypt.hashSync(password, saltRound);
      }
    },
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, saltRound);
      }
    }
  });
};
