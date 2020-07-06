'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`../../api/articles`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await getArticles();

  res.render(`my`, {articles, title: `Мои публикации`, DateTimeFormat});
});
myRouter.get(`/comments`, (req, res) => res.render(`comments`, {title: `Комментарии`}));

module.exports = myRouter;
