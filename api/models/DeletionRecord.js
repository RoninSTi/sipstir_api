const Sequelize = require('sequelize');

const { Model } = require('sequelize');

class DeletionRecord extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      confirmation_code: DataTypes.STRING,
      fbUserId: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }
}

module.exports = {
  DeletionRecord
}
