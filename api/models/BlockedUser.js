const { Model } = require('sequelize');

class BlockedUser extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      blocked: DataTypes.BOOLEAN,
      blockedId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    }, {
      sequelize,
      timestamps: false
    })
  }

  static async blockedUserIds({ userId }) {
    const blockedUsers = await this.findAll({
      where: {
        userId,
        blocked: true
      }
    });

    const ids = blockedUsers.map(({ blockedId }) => blockedId)

    return ids
  }

  static async blockedUserResponse({ userId }) {
    const { User } = this.sequelize.models;

    const blockedUsers = await this.findAll({
      where: {
        userId
      }
    });

    const blockedUserIds = blockedUsers.map(({ blockedId }) => blockedId);

    const users = await User.findAll({
      where: {
        id: blockedUserIds
      }
    });

    const response = blockedUsers.map(bu => {
      const blockedUser = bu.toJSON()

      const user = users.find(({ id }) => id === blockedUser.blockedId)

      return {
        ...user.toJSON(),
        blocked: blockedUser.blocked
      }
    })

    return response;
  }
}

module.exports = {
  BlockedUser
}
