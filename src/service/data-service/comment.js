'use strict';

const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({
  name: `data-service-comments`,
});

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Comment = sequelize.models.comment;
  }

  async findAll(articleId) {
    try {
      return await this._Comment.findAll({
        where: {articleId},
        raw: true
      });
    } catch (error) {
      logger.error(`Can not find comments of article with id ${articleId}. Error: ${error}`);

      return null;
    }
  }

  async delete(commentId) {
    const {Comment} = this._models;

    try {
      const commentForDelete = await Comment.findByPk(commentId, {raw: true});
      const deletedRows = await Comment.destroy({
        where: {
          id: commentId,
        }
      });

      if (!deletedRows) {
        return null;
      }

      return commentForDelete;
    } catch (error) {
      this._logger.error(`Can not delete comment. Error: ${error}`);

      return null;
    }
  }

  async create(id, comment) {
    const {Article, Comment} = this._models;

    try {
      const article = await Article.findByPk(id);
      const newComment = await article.createComment({
        text: comment.text,
        [`user_id`]: 1,
      });

      return await Comment.findByPk(newComment.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create comment for article with ${id}. Error: ${error}`);

      return null;
    }
  }
}

module.exports = CommentService;
