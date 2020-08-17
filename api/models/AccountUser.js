const { Model } = require('sequelize');

class AccountUser extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      accountId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      role: {
        type: DataTypes.ENUM,
        defaultValue: 'admin',
        values: ['admin', 'super-admin']
      }
    }, {
      sequelize,
      timestamps: false
    })
  }
}

module.exports = {
  AccountUser
}
