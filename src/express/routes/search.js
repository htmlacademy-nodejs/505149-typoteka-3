'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getSearchResults = require(`../api/search`);

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => res.render(`search`, {title: `Поиск`}));

searchRouter.get(`/results`, async (req, res) => {
  const query = req.query.search;
  const encodedURI = encodeURI(query);

  const articles = await getSearchResults(encodedURI);

  res.render(`search-results`, {articles, title: `Найдено`, query, DateTimeFormat});
});

module.exports = searchRouter;
