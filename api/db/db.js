const nconf = require('nconf');
const Sequelize = require('sequelize');

const { AccountUser } = require('../models/AccountUser');

const DB = nconf.get('db.mysql.database');
const DIALECT = nconf.get('db.mysql.dialect');
const HOST = nconf.get('db.mysql.host');
const PASSWORD = nconf.get('db.mysql.password');
const USER = nconf.get('db.mysql.user');

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  operatorsAliases: false,
});

const models = {
  AccountUser: AccountUser.init(sequelize, Sequelize)
}

module.exports = {
  ...models,
  sequelize,
};
