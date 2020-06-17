// const mongoose = require('mongoose');

// const connectMongo = (mongoURI) => {
//   mongoose.connect(mongoURI, { useNewUrlParser: true });
//   mongoose.connection.on('error', (err) => {
//     console.log(err);
//     process.exit();
//   });
// };

// module.exports = {
//   connectMongo,
// };

const nconf = require('nconf');
const Sequelize = require("sequelize");

const DB = nconf.get('db.mysql.database');
const DIALECT = nconf.get('db.mysql.dialect');
const HOST = nconf.get('db.mysql.host');
const PASSWORD = nconf.get('db.mysql.password');
const USER = nconf.get('db.mysql.user');

console.log({ DB, DIALECT, HOST, PASSWORD, USER })

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;