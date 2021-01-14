'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createArticleModel: (sequelize) => {
    class Article extends Model {}

    Article.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      announce: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fulltext: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      createdAt: `created_date`,
      updatedAt: false,
      paranoid: false,
      modelName: `article`,
      tableName: `articles`,
    });

    return Article;
  },

  createArticleLinks: (Article, User, Category, Comment) => {
    Article.hasMany(Comment, {
      as: `comments`,
      foreignKey: `article_id`,
    });
    Article.belongsTo(User, {
      foreignKey: `user_id`,
      as: `user`,
    });
    Article.belongsToMany(Category, {
      through: `articles_categories`,
      foreignKey: `article_id`,
      timestamps: false,
      paranoid: false,
    });
  }
};
