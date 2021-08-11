'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
  }

  async findAll({offset, limit, query}) {
    const queryWithCapFirst = query.charAt(0).toUpperCase() + query.slice(1);
    console.log(query, queryWithCapFirst);
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];
    const where = {
      title: {
        [Op.or]: [{
          [Op.substring]: query,
          [Op.substring]: queryWithCapFirst
        }]
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
