const { Model } = require('sequelize');

class Account extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.memberAssociation = models.Account.belongsToMany(models.Member, {
      through: 'AccountMember',
      as: 'members',
      foreignKey: 'accountId',
      otherKey: 'memberId',
    });

    this.locationAssociation = models.Account.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'locationId'
    });

    this.userAssociation = models.Account.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  }

  static async getSingle(id) {
    const account = await this.findByPk(id, { include: [{ all: true, nested: true }] });

    if (!account) return {}

    return account.toJSON();
  }
}

module.exports = {
  Account
}

