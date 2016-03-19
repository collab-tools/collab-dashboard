module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        google_id: DataTypes.STRING,
        email: DataTypes.STRING,
        display_name: DataTypes.STRING,
        display_image: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            isExist: function(email) {
                return this.find({
                    where: {
                        email: email
                    }
                }).then(function(instance) {
                    return instance !== null
                })
            },
            getUserById: function(id) {
                return this.findById(id)
            }
        }
    })
}