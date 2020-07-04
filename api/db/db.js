const Sequelize = require('sequelize');

const { Account } = require('../models/Account');
const { AccountMember } = require('../models/AccountMember');
const { Cheer } = require('../models/Cheer');
const { Comment } = require('../models/Comment');
const { Guess } = require('../models/Guess');
const { Location } = require('../models/Location');
const { Member } = require('../models/Member');
const { Points } = require('../models/Points');
const { Post } = require('../models/Post');
const { Reward } = require('../models/Reward');
const { Subscription } = require('../models/Subscription');
const { User } = require('../models/User');

const sequelize = new Sequelize(process.env.MYSQL_CONNECTION_STRING)

const models = {
  Account: Account.init(sequelize, Sequelize),
  AccountMember: AccountMember.init(sequelize, Sequelize),
  Comment: Comment.init(sequelize, Sequelize),
  Cheer: Cheer.init(sequelize, Sequelize),
  Guess: Guess.init(sequelize, Sequelize),
  Location: Location.init(sequelize, Sequelize),
  Member: Member.init(sequelize, Sequelize),
  Post: Post.init(sequelize, Sequelize),
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
