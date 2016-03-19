module.exports = function(sequelize, DataTypes) {
    return sequelize.define('notifications', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        data: DataTypes.STRING,
        template: DataTypes.STRING,
        is_read: DataTypes.BOOLEAN
    }, {
        underscored: true
    })
}