const { Model } = require('sequelize');
const { parseUserId } = require('../utils/stream');

const { Expo } = require('expo-server-sdk')

const md5 = require('md5');

const crypto = require('crypto')

const expo = new Expo()

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      avatar: DataTypes.STRING,
      email: DataTypes.STRING(126).BINARY,
      password: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('password')
        }
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pointsBalance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pushToken: DataTypes.STRING,
      roles: {
        type: DataTypes.TEXT,
        defaultValue: '["user"]',
        get: function () {
          return JSON.parse(this.getDataValue('roles'));
        },
        set: function (value) {
          this.setDataValue('roles', JSON.stringify(value));
        },
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('salt')
        }
      },
      username: DataTypes.STRING(126).BINARY,
    }, {
      hooks: {
        beforeCreate: function (user) {
          User.setSaltAndPassword(user)

          return user
        },
        beforeUpdate: function (user) {
          User.setSaltAndPassword(user)

          return user
        }
      },
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
      ],
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.User.belongsToMany(models.Account, {
      through: 'AccountUser',
      as: 'accounts',
      foreignKey: 'userId',
      otherKey: 'accountId',
    });
  }

  static generateSalt() {
    return crypto.randomBytes(16).toString('base64')
  }

  static encryptPassword(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }

  static setSaltAndPassword(user) {
    if (user.changed('password')) {
      user.salt = User.generateSalt()
      user.password = User.encryptPassword(user.password(), user.salt())
    }
  }

  static async findOrCreateByEmail({ client, email, redis, ...userData }) {
    const [user, created] = await this.findOrCreate({ where: { email } })

    if (created) {
      await user.addPoints({ amount: 0, redis });

      await user.setDefaultAvatar()

      await client.user(`${user.id}`).getOrCreate();

      const domain = email.substring(email.lastIndexOf("@") + 1);

      if (domain === 'sipstir.app') {
        user.roles = [...user.roles, 'employee']

        await user.save()
      }
    }

    if (userData) {
      Object
        .keys(userData)
        .forEach(key => {
          if (!user.getDataValue(key)) {
            console.log('updating')
            user[key] = userData[key]
          } else {
            return null
          }
        })

      await user.save()
    }

    return user
  }

  static async getSingle({ client, id, redis }) {
    const user = await this.findByPk(id);

    if (!user) return {};

    const allTimeLeaderboardPosition = await redis.zrevrank('leaderboard', user.id);

    const userFeed = client.feed('user', `${id}`);

    const followerResponse = await userFeed.followers();

    const streamFollowers = followerResponse.results;

    const followerIds = streamFollowers.map(obj => parseUserId(obj.target_id)).filter(followerId => followerId !== id);

    const followerUsers = await this.findAll({ where: { id: followerIds } });

    const followers = followerUsers.map(fu => fu.toJSON());

    const timelineFeed = client.feed('timeline', `${id}`);

    const followingResponse = await timelineFeed.following();

    const streamFollowing = followingResponse.results;

    const followingIds = streamFollowing.map(obj => parseUserId(obj.target_id));

    const followingUsers = await this.findAll({ where: { id: followingIds } });

    const following = followingUsers.map(fu => fu.toJSON());

    const response = {
      ...user.toJSON(),
      allTimeLeaderboardPosition: allTimeLeaderboardPosition + 1,
      followers,
      following
    };

    return response;
  }

  async addPoints({ amount, redis }) {
    const { Points } = this.sequelize.models;

    const points = await Points.create({
      amount
    });

    await points.setUser(this);

    this.points = this.points + amount;
    this.pointsBalance = this.pointsBalance + amount;

    redis.zadd('leaderboard', this.points, this.id);

    await this.save();
  }

  correctPassword(enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password()
  }

  async redeemReward({ reward }) {
    this.pointsBalance = this.pointsBalance - reward.points;

    return this.save();
  }

  async sendPush({ body, data }) {
    const pushToken = this.pushToken;

    if (!pushToken) return

    const messageData = {
      to: pushToken,
      sound: 'default',
      body,
      data
    }

    const chunks = expo.chunkPushNotifications([messageData]);

    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  }

  async setDefaultAvatar() {
    const emailHash = md5(this.email.toLowerCase().trim());

    const avatar = `https://www.gravatar.com/avatar/${emailHash}?s=200&d=retro`

    this.avatar = avatar

    await this.save()
  }
}

module.exports = {
  User
}
