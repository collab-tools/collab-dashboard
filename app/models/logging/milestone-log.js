module.exports = function(sequelize, DataTypes) {
    return sequelize.define('milestone_log', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        activity: DateTypes.CHAR,
        date: DataTypes.DATE
    }, {
        underscored: true
    })
}