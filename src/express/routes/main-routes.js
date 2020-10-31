'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const categories = await api.getCategories();
  const articlesId = articles.map((it) => it.id);
  const sortedByQtyOfComments = articles.slice().sort((a, b) => b.comments.length - a.comments.length);
  const sortedByDateComments = (await getSortedByDateComments(articlesId)).slice(0, 4);

  res.render(`main`, {
    articles,
    sortedByQtyOfComments,
    title: `Типотека`,
    DateTimeFormat,
    sortedByDateComments,
    categories
  });
});

mainRouter.get(`/register`, (req, res) => res.render(`login`, {isItLogin: false, title: `Регистрация`}));

mainRouter.get(`/login`, (req, res) => res.render(`login`, {isItLogin: true, title: `Войти`}));

module.exports = mainRouter;
