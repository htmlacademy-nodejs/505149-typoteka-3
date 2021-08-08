'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
  }

  async findAll({offset, limit, query}) {
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];
    const where = {
      title: {
        [Op.substring]: query
        // как сделать независимость от регистра?
      }
    };

    const {count, rows} = await this._Article.findAndCountAll({
      where,
      limit,
      offset,
      include,
      order,
      distinct: true
    });

    return {count, foundArticles: rows};
  }
}

module.exports = SearchService;
