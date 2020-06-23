const { Model } = require('sequelize');

const { Account } = require('./Account');

class Member extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      permissions: DataTypes.STRING
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.association = models.Member.belongsToMany(models.Account, {
      through: 'AccountMember',
      as: 'accounts',
      foreignKey: 'memberId',
      otherKey: 'accountId',
    });
  }

  static async getSingle({ id }) {
    const member = await this.findByPk(id, { include: [{ all: true, nested: true }] });

    if (!member) return {};

    return member.toJSON();
  }
}

module.exports = {
  Member
}
