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
    const category = await categoryService.findOne(id);

    if (!category) {
      logger.error(`Did not find category with ${id}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find category with ${id}`);
    }

    const articlesByCategory = await articleService.findByCategory(category);

    return res.status(HttpCode.OK)
      .json(articlesByCategory);
  });
};
