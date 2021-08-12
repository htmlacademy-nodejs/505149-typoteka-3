'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Aliase = require(`./aliases`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `userId`,
  });
  Article.belongsTo(User, {
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`,
  });
  Comment.belongsTo(User, {
    foreignKey: `userId`
  });

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(Article, {
    foreignKey: `articleId`
  });

  ArticleCategory.init({}, {
    sequelize,
    modelName: `articles_categories`,
  });

  Article.belongsToMany(Category, {
    through: `articles_categories`,
    as: Aliase.CATEGORIES
  });
  Category.belongsToMany(Article, {
    through: `articles_categories`,
    as: Aliase.ARTICLES
  });
  Category.hasMany(ArticleCategory, {
    as: Aliase.ARTICLES_CATEGORIES
  });

  return {Category, Comment, User, Article, ArticleCategory};
};

module.exports = define;
