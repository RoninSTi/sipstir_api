const { Model } = require('sequelize');

class AccountUser extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      email: {
        type: DataTypes.STRING,
        unique: true
      }
    }, {
      sequelize,
      timeStamps: true
    })
  }
}

module.exports = {
  AccountUser
}
