'use strict';

const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../lib/logger`);
const {dateToTime} = require(`../../lib/utils`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);

const logger = getLogger({
  name: `api-server`,
});

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  findByCategory(category) {
    return this._articles.filter((article) => article.category.includes(category));
  }

  create(article) {
    const newArticle = Object
      .assign(
          {
            id: nanoid(MAX_ID_LENGTH),
            comments: [],
            createdDate: new Date().toISOString(),
          }, article);

    newArticle.createdDate = new Date(dateToTime(`d.m.y`, article.createdDate)).toISOString();

    this._articles.push(newArticle);
    return newArticle;
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticle,
        {
          createdDate: new Date().toISOString()
        }, article);
  }

  delete(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      logger.error(`Did not find article`);
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }
}

module.exports = ArticleService;
