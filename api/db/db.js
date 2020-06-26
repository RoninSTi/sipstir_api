const nconf = require('nconf');
const Sequelize = require('sequelize');

const { Account } = require('../models/Account');
const { AccountMember } = require('../models/AccountMember');
const { Location } = require('../models/Location');
const { Member } = require('../models/Member');
const { Reward } = require('../models/Reward');
const { Subscription } = require('../models/Subscription');
const { User } = require('../models/User');

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
  Account: Account.init(sequelize, Sequelize),
  AccountMember: AccountMember.init(sequelize, Sequelize),
  Location: Location.init(sequelize, Sequelize),
  Member: Member.init(sequelize, Sequelize),
  Reward: Reward.init(sequelize, Sequelize),
  Subscription: Subscription.init(sequelize, Sequelize),
  User: User.init(sequelize, Sequelize)
}

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

module.exports = {
  ...models,
  sequelize,
};
