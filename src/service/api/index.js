'use strict';

const {Router} = require(`express`);

const article = require(`../api/article`);
const category = require(`../api/category`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService,
} = require(`../data-service`);

const createApi = async () => {
  const agregatingRouter = new Router();

  const mockData = await getMockData();

  category(agregatingRouter, new CategoryService(mockData));
  article(agregatingRouter, new ArticleService(mockData), new CommentService());
  search(agregatingRouter, new SearchService(mockData));

  return agregatingRouter;
};

module.exports = createApi;
