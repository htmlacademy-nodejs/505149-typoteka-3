'use strict';

const {Router} = require(`express`);

const article = require(`../api/article`);
const category = require(`../api/category`);
const getMockData = require(`../lib/get-mock-data`);

const {
  ArticleService,
  CommentService,
  CategoryService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  article(app, new ArticleService(mockData), new CommentService());
  category(app, new CategoryService(mockData));
})();

module.exports = app;
