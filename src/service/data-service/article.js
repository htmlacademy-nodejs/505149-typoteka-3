'use strict';

const {nanoid} = require(`nanoid`);
const Intl = require(`intl`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);

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
}

module.exports = ArticleService;
