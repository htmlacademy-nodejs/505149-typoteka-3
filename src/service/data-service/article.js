'use strict';

const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../lib/logger`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);

const logger = getLogger();

class ArticleService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  create(offer) {
    const newOffer = Object
      .assign(
          {
            id: nanoid(MAX_ID_LENGTH),
            comments: [],
            createdDate: new Date().toISOString(),
          }, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer,
        {
          createdDate: new Date().toISOString()
        }, offer);
  }

  delete(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      logger.error(`Did not find article`);
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }
}

module.exports = ArticleService;
