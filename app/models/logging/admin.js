module.exports = function(sequelize, DataTypes) {
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
                is: /^[a-z0-9\_\-]+$/i,
            }
        },
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        role: DataTypes.STRING
    }, {
        underscored: true
    })
}