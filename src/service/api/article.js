'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);
const {getLogger} = require(`../../lib/logger`);

const route = new Router();
const logger = getLogger();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const offers = articleService.findAll();

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const offer = articleService.findOne(articleId);

    if (!offer) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const offer = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const offer = articleService.findOne(articleId);

    if (!offer) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    const updatedOffer = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const offer = articleService.delete(articleId);

    if (!offer) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {offer} = res.locals;

    const comments = commentService.findAll(offer);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(offer, commentId);

    if (!deletedComment) {
      logger.error(`Did not find comment with ${commentId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find comment with ${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
