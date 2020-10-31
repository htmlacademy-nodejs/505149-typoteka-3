'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {search = ``} = req.query;

    if (!search) {
      logger.error(`Empty query...`);
      res.status(HttpCode.BAD_REQUEST).json(null);
      return;
    }

    const searchResults = service.findAll(search.toLowerCase());

    if (searchResults.length) {
      res.status(HttpCode.OK).json(searchResults);
    } else {
      logger.info(`Did not find articles`);
      res.status(HttpCode.NOT_FOUND).send(null);
    }
  });
};
