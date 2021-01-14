'use strict';

class CategoryService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async findAll() {
    const {Category} = this._models;

    try {
      const categories = await Category.findAll({raw: true});

      return categories;
    } catch (error) {
      this._logger.error(`Can not find categories. Error: ${error}`);

      return null;
    }
  }

  async findOne(id) {
    const {Category} = this._models;
    const categoryId = Number.parseInt(id, 10);

    try {
      const category = await Category.findByPk(categoryId, {raw: true});

      return category;
    } catch (error) {
      this._logger.error(`Can not find category. Error: ${error}`);

      return null;
    }
  }
}

module.exports = CategoryService;
