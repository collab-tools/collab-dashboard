const Sequelize = require('sequelize');
const config = require('config');

// Setup Sequelize and Connection with Database
// ======================================================
const dbName = config.get('app-database.name');
const dbUsername = config.get('app-database.username');
const dbPassword = config.get('app-database.password');
const dbOptions = config.get('app-database.options');

const sequelize = new Sequelize(
    dbName,
    dbUsername,
    dbPassword,
    dbOptions
);

const modelFiles = [
  'milestone',
  'task',
  'user',
  'project',
  'user-project',
  'notification'
];

modelFiles.forEach(model => {
  module.exports[model] = sequelize.import(`${__dirname}/${model}`);
});

// Setup relations and associations between models based on database design
// ========================================================================
(m => {
  m.task.belongsTo(m.milestone);
  m.task.belongsTo(m.project);

  m.milestone.belongsTo(m.project);
  m.milestone.hasMany(m.task);

  m.project.belongsToMany(m.user, {
    through: m['user-project']
  });
  m.project.hasMany(m.milestone);

  m.user.belongsToMany(m.project, {
    through: m['user-project']
  });
  m.user.hasMany(m.notification);

  m.notification.belongsTo(m.user);
})(module.exports);

// Synchronize all the defined model into the actual mySQL database
// ========================================================================
sequelize.sync().then(() => {}, error => {
  console.log(error);
});

module.exports.sequelize = sequelize;
