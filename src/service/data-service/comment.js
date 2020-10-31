'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {

  findAll(article) {
    return article.comments;
  }

  delete(article, commentId) {
    const commentToDelete = article.comments
      .find((item) => item.id === commentId);

    if (!commentToDelete) {
      return null;
    }

    article.comments = article.comments
      .filter((item) => item.id !== commentId);

    return commentToDelete;
  }

  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      date: new Date().toISOString(),
      articleId: article.id,
    }, comment);

    article.comments.push(newComment);
    return comment;
  }
}

module.exports = CommentService;
