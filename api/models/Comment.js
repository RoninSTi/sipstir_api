// id: ID!
// text: String!
// createdBy: User! @connection
// owner: ID!
// createdAt: Int!

const { Model } = require('sequelize');

class Comment extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      text: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: true
    })
  }

  static associate(models) {
    this.createdAssociation = models.Comment.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });
  }

  static async getSingle({ id }) {
    const comment = await this.findByPk(id, { include: [{ all: true, nested: true }] });

    return comment ? comment.toJSON() : {};
  }
}

module.exports = {
  Comment
};
