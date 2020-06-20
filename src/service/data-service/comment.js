'use strict';

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

}

module.exports = CommentService;
