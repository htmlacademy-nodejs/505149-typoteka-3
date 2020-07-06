'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`../api/articles`);
const getArticle = require(`../api/article`);
const getComments = require(`../api/comments`);

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

  const sortedByCommentDate = await Promise.all(articlesId.map((id) => getComments(id)))
      .then((results) => {
        return results.flat().sort((a, b) => (new Date(b.date)) - (new Date(a.date)));
      });

  const commentsWithArticleTitle = await Promise.all(sortedByCommentDate.map(async (it) => {
    const article = await getArticle(it.articleId);
    it.articleTitle = article.title;
    return it;
  })).then((results) => {
    return results;
  });

  res.render(`comments`, {commentsWithArticleTitle, title: `Комментарии`, DateTimeFormat});
});

module.exports = myRouter;
