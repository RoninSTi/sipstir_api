const { Model } = require('sequelize');

class Points extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      amount: DataTypes.INTEGER
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.userAssociation = models.Points.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  }

  static async buildInitialLeaderboard({ redis }) {
    const rows = await this.findAll({
      group: ['userId'],
      attributes: ['userId', [this.sequelize.fn('SUM', this.sequelize.col('amount')), 'score']],
      order: [
        [this.sequelize.fn('SUM', this.sequelize.col('amount')), 'DESC']
      ]
    });

    redis.flushall()

    rows.forEach(row => {
      const score = parseInt(row.getDataValue('score'));

      redis.zadd('leaderboard', score, row.userId);
    });
  }
}

module.exports = {
  Points
};
