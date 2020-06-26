const { Model } = require('sequelize');

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      avatar: DataTypes.STRING,
      email: DataTypes.STRING,
      pushToken: DataTypes.STRING,
      username: DataTypes.STRING,
    }, {
      indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
      ],
      sequelize,
      timestamps: true
    })
  }
}

module.exports = {
  User
}
