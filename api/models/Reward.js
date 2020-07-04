const { Model } = require('sequelize');

class Reward extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      isActive: DataTypes.BOOLEAN,
      discount: DataTypes.INTEGER,
      image: DataTypes.STRING,
      message: DataTypes.STRING,
      name: DataTypes.STRING,
      points: DataTypes.INTEGER,
      subject: DataTypes.STRING
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.Reward.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'accountId'
    });
  }

  static async resetActiveForAccount(accountId) {
    const rewards = await Reward.findAll({
      where: {
        accountId
      }
    });

    const ids = rewards.map(reward => reward.id);

    return Reward.update({ isActive: false }, { where: { id: ids } });
  }
}

module.exports = {
  Reward
}
