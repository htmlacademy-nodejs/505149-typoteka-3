'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`../api/articles`);
const {getSortedByDateComments} = require(`../../lib/utils`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await getArticles();
  const articlesId = articles.map((it) => it.id);
  const sortedByQtyOfComments = articles.slice().sort((a, b) => b.comments.length - a.comments.length);
  const sortedByDateComments = (await getSortedByDateComments(articlesId)).slice(0, 4);

  res.render(`main`, {articles, sortedByQtyOfComments, title: `Типотека`, DateTimeFormat, sortedByDateComments});
});

mainRouter.get(`/register`, (req, res) => res.render(`login`, {isItLogin: false, title: `Регистрация`}));

mainRouter.get(`/login`, (req, res) => res.render(`login`, {isItLogin: true, title: `Войти`}));

module.exports = mainRouter;
