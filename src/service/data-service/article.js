'use strict';

const {nanoid} = require(`nanoid`);
const Intl = require(`intl`);

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
            createdDate: new Intl.DateTimeFormat(`ru-Ru`, {day: `numeric`, month: `numeric`, year: `numeric`, hour: `numeric`, minute: `numeric`, second: `numeric`}).format(new Date())
          }, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  update(id, offer) {
    const oldOffer = this._offers
      .find((item) => item.id === id);

    return Object.assign(oldOffer,
        {
          createdDate: new Intl.DateTimeFormat(`ru-Ru`, {day: `numeric`, month: `numeric`, year: `numeric`, hour: `numeric`, minute: `numeric`, second: `numeric`}).format(new Date())
        }, offer);
  }

  delete(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      logger.error(`Did not found article`);
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }
}

module.exports = ArticleService;
