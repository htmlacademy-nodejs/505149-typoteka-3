'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliases`);
const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({name: `init-db`});

module.exports = async (sequelize, {categories, articles, users}) => {
  try {
    const {Category, Article, User} = defineModels(sequelize);
    const result = await sequelize.sync({force: true});
    logger.info(`Successfully created ${result.config.database} database`);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({
          title: item,
          picture: `picture.png`,
        }))
    );

    const categoryIdByName = categoryModels.reduce((acc, next) => ({
      [next.title]: next.id,
      ...acc
    }), {});

    const userModels = await User.bulkCreate(users, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});

    const userIdByEmail = userModels.reduce((acc, next) => ({
      [next.email]: next.id,
      ...acc
    }), {});

    articles.forEach((article) => {
      article.userId = userIdByEmail[article.user];
      article.comments.forEach((comment) => {
        comment.userId = userIdByEmail[comment.user];
      });
    });

    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
      await articleModel.addCategories(
          article.categories.map(
              (title) => categoryIdByName[title]
          )
      );
    });
    await Promise.all(articlePromises);

    logger.info(`Successfully filled ${result.config.database} database`);
  } catch (error) {
    logger.error(error);
  }
};

