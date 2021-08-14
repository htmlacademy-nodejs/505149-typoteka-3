'use strict';

const {Router} = require(`express`);

const sequelize = require(`../database/sequelize`);
const defineModels = require(`../models`);
const article = require(`../api/article`);
const category = require(`../api/category`);
const search = require(`../api/search`);
const user = require(`../api/user`);

const {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService,
  UserService,
} = require(`../data-service`);

defineModels(sequelize);

const createApi = async () => {
  const agregatingRouter = new Router();

  category(agregatingRouter, new CategoryService(sequelize));
  article(agregatingRouter, new ArticleService(sequelize), new CommentService(sequelize));
  search(agregatingRouter, new SearchService(sequelize));
  user(agregatingRouter, new UserService(sequelize));

  return agregatingRouter;
};

module.exports = createApi;
