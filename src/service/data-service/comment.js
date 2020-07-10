'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {

  findAll(offer) {
    return offer.comments;
  }

  delete(offer, commentId) {
    const commentToDelete = offer.comments
      .find((item) => item.id === commentId);

    if (!commentToDelete) {
      return null;
    }

    offer.comments = offer.comments
      .filter((item) => item.id !== commentId);

    return commentToDelete;
  }

  create(offer, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      date: new Date().toISOString(),
      articleId: offer.id,
    }, comment);

    offer.comments.push(newComment);
    return comment;
  }
}

module.exports = CommentService;
