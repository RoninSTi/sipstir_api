const { Model } = require('sequelize');
const { parseUserId } = require('../utils/stream');

const { Expo } = require('expo-server-sdk')

const expo = new Expo()

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      avatar: DataTypes.STRING,
      email: DataTypes.STRING(126).BINARY,
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
      username: DataTypes.STRING(126).BINARY,
    }, {
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
      ],
      sequelize,
      timestamps: true
    })
  }

  static async findOrCreateByEmail({ client, email, redis, ...userData }) {
    const [user, created] = await this.findOrCreate({ where: { email } })

    if (created) {
      await user.addPoints({ amount: 0, redis });

      await client.user(`${user.id}`).getOrCreate();
    }

    if (userData) {
      const updates = Object
        .keys(userData)
        .map(key => {
          if (!user[key]) {
            user[key] = userData[key]

            return user.save()
          } else {
            return null
          }
        })
        .filter(element => element !== null)

      await Promise.all(updates)
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
}

module.exports = {
  User
}
