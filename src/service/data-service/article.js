'use strict';

class ArticleService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return this._offers;
  }
}

module.exports = ArticleService;
