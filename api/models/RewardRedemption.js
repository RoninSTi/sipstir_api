const { Model } = require('sequelize');

class RewardRedemption extends Model {
  static init(sequelize, DataTypes) {
    return super.init({}, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.userAssociation = models.RewardRedemption.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })

    this.userAssociation = models.RewardRedemption.belongsTo(models.Reward, {
      as: 'reward',
      foreignKey: 'rewardId'
    })
  }
}

module.exports = {
  RewardRedemption
}
