'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const sortedByQtyOfComments = articles.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 4);
  const sortedByDateComments = (await getSortedByDateComments(articles)).slice(0, 4);

  res.render(`main`, {
    articles,
    sortedByQtyOfComments,
    title: `Типотека`,
    DateTimeFormat,
    sortedByDateComments,
    categories,
    page,
    totalPages,
  });
});

mainRouter.get(`/registration`, (req, res) => res.render(`registration`, {title: `Регистрация`}));

mainRouter.get(`/login`, (req, res) => res.render(`login`, {title: `Войти`}));

module.exports = mainRouter;
