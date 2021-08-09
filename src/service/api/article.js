'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);
const {getLogger} = require(`../../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server-article`,
});

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, comments} = req.query;
    let result;

    try {
      if (limit || offset) {
        result = await articleService.findPage({limit, offset, comments});
      } else {
        result = await articleService.findAll(comments);
      }

      res.status(HttpCode.OK).json(result);
    } catch (err) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
    }
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/articles${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .json(article);
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const result = await articleService.findByCategory({limit, offset, categoryId});

    if (!result) {
      logger.error(`Did not find articles with category ${categoryId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find articles with category ${categoryId}`);
    }

    return res.status(HttpCode.OK)
      .json(result);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    if (!article) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create article`);
    }

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;

    const isArticleUpdated = await articleService.update(articleId, req.body);

    if (!isArticleUpdated) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/articles${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK).send(`Updated`);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const isArticleDeleted = await articleService.drop(articleId);

    if (!isArticleDeleted) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not delete article`);
    }

    return res.status(HttpCode.OK).send(`Deleted!`);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    if (!comments) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}`);
      return res.status(HttpCode.NOT_FOUND).send(`Can not find comments for article with id ${articleId}.`);
    }

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const isCommentDeleted = await commentService.drop(commentId);

    if (!isCommentDeleted) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment not found`);
    }

    return res.status(HttpCode.OK).send(`Deleted!`);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    if (!comment) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create comment`);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
