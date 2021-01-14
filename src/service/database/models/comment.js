'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createCommentModel: (sequelize) => {
    class Comment extends Model {}

    Comment.init({
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      createdAt: `created_date`,
      updatedAt: false,
      paranoid: false,
      modelName: `comment`,
      tableName: `comments`,
    });

    return Comment;
  },

  createCommentLinks: (Comment, User, Article) => {
    Comment.belongsTo(User, {
      foreignKey: `user_id`,
      as: `user`,
    });
    Comment.belongsTo(Article, {
      foreignKey: `article_id`,
      as: `article`,
    });
  }
};
