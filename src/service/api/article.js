'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const offer = service.findOne(articleId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });
};
