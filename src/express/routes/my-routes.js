'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const api = require(`../api`).getAPI();
const auth = require(`../middleware/auth`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
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
    user
  });
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  const sortedByDateComments = await getSortedByDateComments(articles);
  res.render(`comments`, {
    sortedByDateComments,
    articles,
    title: `Комментарии`,
    DateTimeFormat,
    user
  });
});

module.exports = myRouter;
