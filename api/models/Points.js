const { Model } = require('sequelize');

class Points extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      amount: DataTypes.INTEGER
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.userAssociation = models.Points.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  }
}

module.exports = {
  Points
};
