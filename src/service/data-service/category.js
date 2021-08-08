'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliases`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.category;
    this._ArticleCategory = sequelize.models.articles_categories;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `title`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  // async findOne(id) {
  //   const {Category} = this._models;
  //   const categoryId = Number.parseInt(id, 10);

  //   try {
  //     const category = await Category.findByPk(categoryId, {raw: true});

  //     return category;
  //   } catch (error) {
  //     this._logger.error(`Can not find category. Error: ${error}`);

  //     return null;
  //   }
  // }
}

module.exports = CategoryService;
