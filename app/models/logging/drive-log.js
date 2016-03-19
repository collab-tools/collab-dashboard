module.exports = function(sequelize, DataTypes) {
    return sequelize.define('drive_log', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        activity: DateTypes.CHAR,
        filename: DateTypes.STRING,
        date: DataTypes.DATE
    }, {
        underscored: true
    })
}