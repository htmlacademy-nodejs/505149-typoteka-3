'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);
const {getLogger} = require(`../../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    return res.status(HttpCode.OK)
        .json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.delete(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(article, commentId);

    if (!deletedComment) {
      logger.error(`Did not find comment with ${commentId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find comment with ${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
