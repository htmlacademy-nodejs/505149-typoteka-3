'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.render(`new-post`, {}));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`, {}));
articlesRouter.get(`/categories`, (req, res) => res.render(`all-categories`, {}));
articlesRouter.get(`/:id`, (req, res) => res.render(`post`, {}));

module.exports = articlesRouter;
