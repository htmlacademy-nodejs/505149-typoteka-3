'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getSearchResults = require(`../api/search`);

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => res.render(`search`, {title: `Поиск`}));

searchRouter.get(`/results`, async (req, res) => {
  const query = req.query.query;
  const encodedURI = encodeURI(query);
  const message = query ? `Ничего не найдено` : `Пустой запрос`;

  const articles = await getSearchResults(encodedURI);

  if (articles) {
    res.render(`search-results`, {articles, title: `Найдено`, query, DateTimeFormat});
  } else {
    res.render(`search-empty`, {title: `Ничего не найдено`, query, message});
  }
});

module.exports = searchRouter;
