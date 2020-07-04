const { Model } = require('sequelize');

class Guess extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      correct: DataTypes.BOOLEAN,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.createdAssociation = models.Guess.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });

    this.locationAssociation = models.Guess.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'locationId'
    });

    this.commentsAssociation = models.Guess.hasMany(models.Comment, {
      as: 'comments'
    });
  }

  static async getSingle({ id }) {
    const {
      Comment: CommentModel,
      Location: LocationModel,
      User: UserModel
    } = this.sequelize.models;

    const guess = await this.findByPk(id, {
      order: [
        [{ model: CommentModel, as: 'comments' }, 'createdAt', 'ASC']
      ],
      include: [
        {
          model: UserModel,
          as: 'createdBy'
        }, {
          model: LocationModel,
          as: 'location'
        }, {
          model: CommentModel,
          as: 'comments',
          include: [
            {
              model: UserModel,
              as: 'createdBy'
            }
          ]
        }
      ]
    });

    return guess ? guess.toJSON() : {};
  }
}

module.exports = {
  Guess
};
