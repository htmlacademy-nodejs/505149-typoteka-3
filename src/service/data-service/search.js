'use strict';

class SearchService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll(searchText) {
    const {Article} = this._models;

    const articles = await Article.findAll();
    const preparedArticles = [];

    for (const article of articles) {
      const categories = await article.getCategories({raw: true});
      article.dataValues.category = categories;
      preparedArticles.push(article.dataValues);
    }

    return preparedArticles.filter((article) => article.title.toLowerCase().includes(searchText));
  }
}

module.exports = SearchService;
