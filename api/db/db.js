const Sequelize = require('sequelize');

const fs = require('fs');

const { Account } = require('../models/Account');
const { AccountUser } = require('../models/AccountUser');
const { BlockedUser } = require('../models/BlockedUser');
const { Cheer } = require('../models/Cheer');
const { Comment } = require('../models/Comment');
const { Guess } = require('../models/Guess');
const { Location } = require('../models/Location');
const { Member } = require('../models/Member');
const { PaymentMethod } = require('../models/PaymentMethod');
const { Points } = require('../models/Points');
const { Post } = require('../models/Post');
const { ReportedPost } = require('../models/ReportedPost');
const { Reward } = require('../models/Reward');
const { RewardRedemption } = require('../models/RewardRedemption');
const { Subscription } = require('../models/Subscription');
const { User } = require('../models/User');

const config = {
  dialect: "postgres",
  dialectOptions: {},
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    timestamps: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  config.dialectOptions.ssl = {
    require: true,
    ca: fs.readFileSync(`${__dirname}/SSLCA.pem`),
  }
}

const sequelize = new Sequelize(process.env.DATABASE_URI, config);

const models = {
  Account: Account.init(sequelize, Sequelize),
  AccountUser: AccountUser.init(sequelize, Sequelize),
  BlockedUser: BlockedUser.init(sequelize, Sequelize),
  Comment: Comment.init(sequelize, Sequelize),
  Cheer: Cheer.init(sequelize, Sequelize),
  Guess: Guess.init(sequelize, Sequelize),
  Location: Location.init(sequelize, Sequelize),
  Member: Member.init(sequelize, Sequelize),
  PaymentMethod: PaymentMethod.init(sequelize, Sequelize),
  Points: Points.init(sequelize, Sequelize),
  Post: Post.init(sequelize, Sequelize),
  ReportedPost: ReportedPost.init(sequelize, Sequelize),
  Reward: Reward.init(sequelize, Sequelize),
  RewardRedemption: RewardRedemption.init(sequelize, Sequelize),
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
