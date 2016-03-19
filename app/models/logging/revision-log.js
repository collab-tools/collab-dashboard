module.exports = function(sequelize, DataTypes) {
    return sequelize.define('revision_log', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        fileUUID: DateTypes.STRING,
        date: DataTypes.DATE
    }, {
        underscored: true
    })
}