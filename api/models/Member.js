const { Model } = require('sequelize');

const { Account } = require('./Account');

class Member extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      email: DataTypes.STRING(126).BINARY,
      permissions: DataTypes.STRING
    }, {
      indexes: [
        { unique: true, fields: ['email'] },
      ],
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
