'use strict';

class CommentService {

  findAll(offer) {
    return offer.comments;
  }

}

module.exports = CommentService;
