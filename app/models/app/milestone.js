module.exports = function(sequelize, DataTypes) {
    return sequelize.define('milestones', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        content: DataTypes.TEXT,
        deadline: DataTypes.DATE,
        github_id: DataTypes.BIGINT,
        github_number: DataTypes.INTEGER
    }, {
        underscored: true,
        classMethods: {
            isExist: function(id) {
                return this.findById(id).then(function(instance) {
                    return instance !== null
                })
            }
        }
    })
}