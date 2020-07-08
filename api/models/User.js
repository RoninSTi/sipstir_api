const { Model } = require('sequelize');

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      avatar: DataTypes.STRING,
      email: DataTypes.STRING,
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pointsBalance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      pushToken: DataTypes.STRING,
      username: DataTypes.STRING,
    }, {
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
      ],
      sequelize,
      timestamps: true
    })
  }

  async addPoints({ amount, redis }) {
    const { Points } = this.sequelize.models;

    const points = await Points.create({
      amount
    });

    redis.zadd('leaderboard', amount, this.id);

    await points.setUser(this);

    this.points = this.points + amount;
    this.pointsBalance = this.pointsBalance + amount;

    await this.save();
  }
}

module.exports = {
  User
}
