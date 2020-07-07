'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const getArticle = require(`../api/article`);
const getCategories = require(`../api/categories`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`new-post`, {title: `Новая публикация`}));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`, {title: `Статьи по категории`}));
articlesRouter.get(`/categories`, (req, res) => res.render(`all-categories`, {title: `Категории`}));
articlesRouter.get(`/:id`, (req, res) => res.render(`post`, {title: `Пост`}));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getArticle(id);
  const categories = await getCategories();

  if (article) {
    res.render(`new-post`, {article, DateTimeFormat, title: `Редакция публикации`, categories});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = articlesRouter;
