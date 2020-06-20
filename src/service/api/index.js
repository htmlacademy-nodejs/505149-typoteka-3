'use strict';

const {Router} = require(`express`);

const article = require(`../api/article`);
const getMockData = require(`../lib/get-mock-data`);

const {
  ArticleService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  article(app, new ArticleService(mockData));
})();

module.exports = app;
