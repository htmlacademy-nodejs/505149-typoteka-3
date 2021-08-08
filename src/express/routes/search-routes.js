'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const searchRouter = new Router();

searchRouter.get(`/`, async (req, res) => res.render(`search`, {title: `Поиск`}));

searchRouter.get(`/results`, async (req, res) => {
  let {page = 1} = req.query;
  const query = req.query.query;
  page = +page;

  if (!query) {
    res.render(`search-empty`, {title: `Ничего не найдено`, query, message: `Пустой запрос`});
  }

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, foundArticles}] = await Promise.all([
    api.search({limit, offset, query})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  if (foundArticles.length > 0) {
    res.render(`search-results`, {
      count,
      foundArticles,
      page,
      totalPages,
      query,
      DateTimeFormat
    });
  } else {
    res.render(`search-empty`, {title: `Ничего не найдено`, query, message: `Ничего не найдено`});
  }
});

module.exports = searchRouter;
