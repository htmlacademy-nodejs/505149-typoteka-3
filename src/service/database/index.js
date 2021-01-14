'use strict';

const Sequelize = require(`sequelize`);

const {createUserModel, createUserLinks} = require(`./models/user`);
const {createArticleModel, createArticleLinks} = require(`./models/article`);
const {createCategoryModel, createCategoryLinks} = require(`./models/category`);
const {createCommentModel, createCommentLinks} = require(`./models/comment`);
const {getLogger} = require(`../../lib/logger`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT} = require(`../../../config`);

const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

const logger = getLogger({
  name: `db-server`,
});

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000
  }
});

const User = createUserModel(sequelize);
const Article = createArticleModel(sequelize);
const Category = createCategoryModel(sequelize);
const Comment = createCommentModel(sequelize);

createUserLinks(Article, User, Comment);
createArticleLinks(Article, User, Category, Comment);
createCategoryLinks(Article, Category);
createCommentLinks(Comment, User, Article);

module.exports = {
  sequelize,
  models: {
    User,
    Article,
    Category,
    Comment,
  },
};
