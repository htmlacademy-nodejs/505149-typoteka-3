'use strict';

const {getLogger} = require(`../../lib/logger`);
const Aliase = require(`../models/aliases`);

const logger = getLogger({
  name: `data-service-comments`,
});

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Comment = sequelize.models.comment;
    this._User = sequelize.models.user;
  }

  async findAll(articleId) {
    try {
      return await this._Comment.findAll({
        where: {articleId},
        include: {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
      });
    } catch (error) {
      logger.error(`Can not find comments of article with id ${articleId}. Error: ${error}`);

      return null;
    }
  }

  async drop(commentId) {
    try {
      const deletedRow = await this._Comment.destroy({
        where: {id: commentId}
      });
      return !!deletedRow;
    } catch (error) {
      logger.error(`Can not delete comment. Error: ${error}`);

      return null;
    }
  }

  async create(articleId, comment) {
    try {
      const newComment = await this._Comment.create({
        articleId,
        ...comment
      });

      return newComment;
    } catch (error) {
      logger.error(`Can not create comment for article with ${articleId}. Error: ${error}`);

      return null;
    }
  }
}

module.exports = CommentService;
