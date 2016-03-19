const baseModels = 

const Sequelize = require('sequelize')
const config = require('config')

// Setup Sequelize and Connection with Database
// ======================================================
const dbName = config.get('logging-database.name')
const dbUsername = config.get('logging-database.username')
const dbPassword = config.get('logging-database.password')
const dbOptions = config.get('logging-database.options')

var sequelize = new Sequelize(
    dbName,
    dbUsername,
    dbPassword,
    dbOptions
)

var modelFiles = [
    'admin',
    'commit-log',
    'drive-log',
    'milestone-log',
    'revision-log',
    'task-log'
]

modelFiles.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
})

// Setup relations and associations between models based on database design
// ========================================================================
const appModels = require('../app')
(function(m) {
    appModels['user'].hasMany(m['commit-log'])
    appModels['user'].hasMany(m['drive-log'])
    appModels['user'].hasMany(m['milestone-log'])
    appModels['user'].hasMany(m['revision-log'])
    appModels['user'].hasMany(m['task-log'])

    appModels['project'].hasMany(m['commit-log'])
    appModels['project'].hasMany(m['drive-log'])
    appModels['project'].hasMany(m['milestone-log'])
    appModels['project'].hasMany(m['revision-log'])
    appModels['project'].hasMany(m['task-log'])

    appModels['milestone'].hasMany(m['milestone-log'])
    appModels['task'].hasMany(m['task-log'])
    
    m['commit-log'].belongsTo(appModels['user'])
    m['commit-log'].belongsTo(appModels['project'])

    m['revision-log'].belongsTo(appModels['user'])
    m['revision-log'].belongsTo(appModels['project'])

    m['drive-log'].belongsTo(appModels['user'])
    m['drive-log'].belongsTo(appModels['project'])

    m['milestone-log'].belongsTo(appModels['user'])
    m['milestone-log'].belongsTo(appModels['project'])
    m['milestone-log'].belongsTo(appModels['milestone'])

    m['task-log'].belongsTo(appModels['user'])
    m['task-log'].belongsTo(appModels['project'])
    m['task-log'].belongsTo(appModels['task'])
})(module.exports)

// Synchronize all the defined model into the actual mySQL database
// ========================================================================
sequelize.sync().then(function() {}, function(error) {
    console.log(error)
})

module.exports.sequelize = sequelize