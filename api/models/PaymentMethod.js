const { Model } = require('sequelize');

class PaymentMethod extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      brand: DataTypes.STRING,
      expMonth: DataTypes.INTEGER,
      expYear: DataTypes.INTEGER,
      isDefault: DataTypes.BOOLEAN,
      last4: DataTypes.STRING,
      stripePaymentMethodId: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.PaymentMethod.belongsTo(models.Account, {
      as: 'account',
      foreignKey: 'accountId'
    });
  }
}

module.exports = {
  PaymentMethod
}
