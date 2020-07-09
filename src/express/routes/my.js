'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`../api/articles`);
const getArticle = require(`../api/article`);
const {getSortedByDateComments} = require(`../../lib/utils`);

const myRouter = new Router();

let myArticles = null;

myRouter.get(`/`, async (req, res) => {
  myArticles = await getArticles();

  res.render(`my`, {myArticles, title: `Мои публикации`, DateTimeFormat});
});

myRouter.get(`/comments`, async (req, res) => {
  if (!myArticles) {
    myArticles = (await getArticles()).slice(0, 3);
  } else {
    myArticles = myArticles.slice(0, 3);
  }

  const articlesId = myArticles.map((it) => it.id);
  const sortedByDateComments = await getSortedByDateComments(articlesId);
  for (const comment of sortedByDateComments) {
    comment.articleTitle = (await getArticle(comment.articleId)).title;
  }

  res.render(`comments`, {sortedByDateComments, title: `Комментарии`, DateTimeFormat});
});

module.exports = myRouter;
