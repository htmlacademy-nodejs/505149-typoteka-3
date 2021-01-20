'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

const myRouter = new Router();

let myArticles = null;

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
  if (!myArticles) {
    myArticles = (await api.getArticles()).slice(0, 3);
  } else {
    myArticles = myArticles.slice(0, 3);
  }

  const articlesId = myArticles.map((it) => it.id);
  const sortedByDateComments = await getSortedByDateComments(articlesId);
  for (const comment of sortedByDateComments) {
    comment.articleTitle = (await api.getArticle(comment[`article_id`])).title;
  }

  res.render(`comments`, {sortedByDateComments, title: `Комментарии`, DateTimeFormat});
});

module.exports = myRouter;
