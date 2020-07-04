const { Model } = require('sequelize');

class AccountMember extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      accountId: DataTypes.INTEGER,
      memberId: DataTypes.INTEGER,
      role: {
        type: DataTypes.ENUM,
        defaultValue: 'user',
        values: ['admin', 'user']
      }
    }, {
      sequelize,
      timestamps: false
    })
  }
}

module.exports = {
  AccountMember
}
