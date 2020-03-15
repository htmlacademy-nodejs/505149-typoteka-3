'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`new-post`, {title: `Новая публикация`}));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`, {title: `Статьи по категории`}));
articlesRouter.get(`/categories`, (req, res) => res.render(`all-categories`, {title: `Категории`}));
articlesRouter.get(`/:id`, (req, res) => res.render(`post`, {title: `Пост`}));

module.exports = articlesRouter;
