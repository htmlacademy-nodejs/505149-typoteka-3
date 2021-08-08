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
    const article = await articleService.findOne(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .json(article);
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
    const article = await articleService.findOne(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.delete(articleId);

    if (!article) {
      logger.error(`Did not find article with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;

    const comments = await commentService.findAll(article.id);

    if (!comments) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}`);
      return res.status(HttpCode.NOT_FOUND).send(`Can not find comments for article with id ${article.id}.`);
    }

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      logger.error(`Did not find comment with ${commentId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find comment with ${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    if (!comment) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create comment`);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
