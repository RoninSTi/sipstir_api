const { Model } = require('sequelize');

class Reward extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      isActive: DataTypes.BOOLEAN,
      discount: DataTypes.INTEGER,
      image: DataTypes.STRING,
      message: DataTypes.STRING,
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
}

module.exports = {
  Reward
}
