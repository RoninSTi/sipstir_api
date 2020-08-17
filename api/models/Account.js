const { Model } = require('sequelize');
const { createCustomer } = require('../adaptors/stripeAdaptor');

class Account extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      contactName: DataTypes.STRING,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      stripeCustomerId: DataTypes.STRING
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.memberAssociation = models.Account.belongsToMany(models.User, {
      through: 'AccountUser',
      as: 'users',
      foreignKey: 'accountId',
      otherKey: 'userId',
    });

    this.locationAssociation = models.Account.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'locationId'
    });
  }

  static async getSingle(id) {
    const account = await this.findByPk(id, { include: [{ all: true, nested: true }] });

    if (!account) return {}

    return account.toJSON();
  }

  async createStripeAccount({ stripe }) {
    if (!this.email) throw new Error('Account requires email')

    const customer = await createCustomer({ stripe, email: this.email });

    this.stripeCustomerId = customer.id;

    return this.save()
  }
}

module.exports = {
  Account
}

