const { Model } = require('sequelize');

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      avatar: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      pushToken: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        unique: true
      }
    }, {
      sequelize,
      timestamps: true
    })
  }
}

module.exports = {
  User
}
