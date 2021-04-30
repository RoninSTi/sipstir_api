const { Model } = require('sequelize');

class Cheer extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      isCheered: DataTypes.BOOLEAN
    }, {
      indexes: [
        {
          unique: true,
          fields: ['postId', 'createdById']
        }
      ],
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.createdAssociation = models.Cheer.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });

    this.postAssociation = models.Cheer.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
  }
}

module.exports = {
  Cheer
};
