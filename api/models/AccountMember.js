const { Model } = require('sequelize');

class AccountMember extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      accountId: DataTypes.INTEGER,
      memberId: DataTypes.INTEGER
    }, {
      sequelize,
      timestamps: false
    })
  }
}

module.exports = {
  AccountMember
}
