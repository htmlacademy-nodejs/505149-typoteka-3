'use strict';

const {Router} = require(`express`);

const article = require(`../api/article`);
const category = require(`../api/category`);
const search = require(`../api/search`);

const {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService,
} = require(`../data-service`);

const createApi = async (db, logger) => {
  const agregatingRouter = new Router();

  category(agregatingRouter, new CategoryService(db, logger), new ArticleService(db, logger));
  article(agregatingRouter, new ArticleService(db, logger), new CommentService(db, logger));
  search(agregatingRouter, new SearchService(db, logger));

  return agregatingRouter;
};

module.exports = createApi;
