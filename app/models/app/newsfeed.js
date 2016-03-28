module.exports = (sequelize, DataTypes) => {
  return sequelize.define('newsfeed', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    data: DataTypes.STRING,
    template: DataTypes.STRING
  }, {
    underscored: true
  });
};
