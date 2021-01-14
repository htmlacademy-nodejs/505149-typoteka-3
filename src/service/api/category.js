'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, categoryService, articleService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;

    const articlesByCategory = await articleService.findByCategory(id);

    if (!articlesByCategory) {
      logger.error(`Did not find articles with category ${id}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find articles with category ${id}`);
    }

    return res.status(HttpCode.OK)
      .json(articlesByCategory);
  });
};
