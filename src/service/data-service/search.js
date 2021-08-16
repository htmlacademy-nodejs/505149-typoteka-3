'use strict';

const {Op} = require(`sequelize`);

const Aliase = require(`../models/aliases`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._User = sequelize.models.user;
  }

  async findAll({offset, limit, query}) {
    const queryWithCapFirst = query.charAt(0).toUpperCase() + query.slice(1);
    const queryWithLowFirst = query.charAt(0).toLowerCase() + query.slice(1);
    const include = [Aliase.CATEGORIES, {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];
    const order = [[`created_date`, `DESC`]];
    const where = {
      title: {
        [Op.or]: [
          {[Op.substring]: queryWithCapFirst},
          {[Op.substring]: queryWithLowFirst},
          {[Op.substring]: query}
        ]
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
