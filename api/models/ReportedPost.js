const { Model } = require('sequelize');

class ReportedPost extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    }, {
      indexes: [
        {
          unique: true,
          fields: ['postId', 'userId']
        }
      ],
      sequelize,
      timestamps: false
    })
  }

  static async reportedPostIds({ userId }) {
    const reportedPosts = await this.findAll({
      where: {
        userId,
      }
    });

    const ids = reportedPosts.map(({ postId }) => postId)

    return ids
  }
}


module.exports = {
  ReportedPost
}
