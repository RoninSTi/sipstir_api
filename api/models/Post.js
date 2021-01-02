const { Model } = require('sequelize');

const moment = require('moment');

class Post extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      caption: DataTypes.STRING,
      image: DataTypes.STRING,
      cheers: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      reported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      revealed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        type: DataTypes.STRING,
        get: function () {
          const createdAt = moment(this.getDataValue('createdAt'));
          const expiresAt = createdAt.add(12, 'hours');

          return moment().isAfter(expiresAt);
        },
      },
      guessesCorrect: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      guessesWrong: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.createdAssociation = models.Post.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });

    this.locationAssociation = models.Post.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'locationId'
    });

    this.guessesAssociation = models.Post.hasMany(models.Guess, {
      as: 'guesses'
    });
  }

  static getNestedInclude() {
    const {
      Comment: CommentModel,
      Guess: GuessModel,
      Location: LocationModel,
      User: UserModel
    } = this.sequelize.models;

    const include = [
      {
        model: UserModel,
        as: 'createdBy',
      }, {
        model: LocationModel,
        as: 'location',
      }, {
        model: GuessModel,
        as: 'guesses',
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
      }];

    return include;
  }

  static async getSingle({ id, userId }) {
    const {
      Cheer,
      Comment,
      Guess
    } = this.sequelize.models;

    const post = await this.findByPk(id, {
      include: this.getNestedInclude(),
      order: [
        [{ model: Guess, as: 'guesses' }, 'createdAt', 'ASC'],
        [
          { model: Guess, as: 'guesses' },
          { model: Comment, as: 'comments' }, 'createdAt', 'ASC',
        ],
      ]
    });

    if (!post) {
      return {};
    }

    let response = post.toJSON();

    if (userId) {
      const guesses = await Guess.findAll({
        where: {
          createdById: userId
        }
      });

      const cheers = await Cheer.findAll({
        where: {
          createdById: userId
        }
      });

      const isGuessed = guesses.some(guess => guess.PostId === post.id);
      const isCheered = cheers.some(cheer => cheer.postId === post.id && cheer.isCheered)

      response = {
        ...response,
        isCheered,
        isGuessed
      };
    }

    return response;
  }

  static async feedResponse({ rawResponse, userId }) {
    const {
      Cheer,
      Guess
    } = this.sequelize.models;

    const guesses = await Guess.findAll({
      where: {
        createdById: userId
      }
    });

    const cheers = await Cheer.findAll({
      where: {
        createdById: userId
      }
    });

    const response = rawResponse.map(post => {
      const isGuessed = guesses.some(guess => guess.PostId === post.id);
      const isCheered = cheers.some(cheer => cheer.postId === post.id && cheer.isCheered)

      return {
        ...post,
        isCheered,
        isGuessed
      }
    });

    return response;
  }
}

module.exports = {
  Post
}
