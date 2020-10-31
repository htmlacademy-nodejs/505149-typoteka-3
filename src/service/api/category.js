'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, categoryService, articleService) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = categoryService.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const categories = categoryService.findAll();
    const selectedCategory = categories[id - 1];
    const articlesByCategory = articleService.findByCategory(selectedCategory);
    res.status(HttpCode.OK)
      .json(articlesByCategory);
  });
};
