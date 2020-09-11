const { Model } = require('sequelize');

class Subscription extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stripeSubscriptionId: DataTypes.STRING,
      currentPeriodEnd: DataTypes.INTEGER,
      stripeCustomerId: DataTypes.STRING,
      stripePriceId: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.Subscription.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'accountId'
    });
  }
}

module.exports = {
  Subscription
}
