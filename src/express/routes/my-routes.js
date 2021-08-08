'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const {count, articles} = await api.getArticles({limit, offset});
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`my`, {
    articles,
    title: `Мои публикации`,
    DateTimeFormat,
    page,
    totalPages,
  });
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const sortedByDateComments = await getSortedByDateComments(articles);
  res.render(`comments`, {sortedByDateComments, articles, title: `Комментарии`, DateTimeFormat});
});

module.exports = myRouter;
