'use strict';

class CommentService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll(id) {
    const {Article} = this._models;

    try {
      const article = await Article.findByPk(id);
      return await article.getComments({raw: true});
    } catch (error) {
      this._logger.error(`Can not find comments of article with id ${id}. Error: ${error}`);

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
