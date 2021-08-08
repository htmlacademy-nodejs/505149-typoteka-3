'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliases`);
const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({
  name: `data-service-article`
});

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Comment = sequelize.models.comment;
    this._Category = sequelize.models.category;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const articles = await this._Article.findAll({include, order});
    return articles.map((item) => item.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Aliase.CATEGORIES];
    const order = [[`created_date`, `DESC`]];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order,
      distinct: true
    });
    return {count, articles: rows};
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Article.findByPk(id, {include});
  }

  async findByCategory({limit, offset, categoryId}) {
    const include = [Aliase.CATEGORIES, Aliase.COMMENTS];
    const {count, rows} = await this._Article.findAndCountAll({
      attributes: [`id`],
      include: [{
        model: this._Category,
        as: Aliase.CATEGORIES,
        attributes: [],
        where: {
          id: categoryId
        },
      }],
      limit,
      offset,
      raw: true
    });

    const articles = await this._Article.findAll({
      include,
      where: {
        id: {
          [Sequelize.Op.in]: rows.map((it) => it.id)
        }
      },
    });

    return {count, articles};
  }

  async create(articleData) {
    try {
      const article = await this._Article.create(articleData);
      await article.addCategories(articleData.categories);
      return article.get();
    } catch (error) {
      return logger.error(error);
    }
  }

  async update(id, article) {
    try {
      const [affectedRows] = await this._Article.update(article, {
        where: {id},
      });
      const articleCategories = await this._Category.findAll({
        where: {
          id: {
            [Sequelize.Op.or]: article.categories,
          },
        }
      });
      const updatedArticle = await this._Article.findByPk(id);
      await updatedArticle.setCategories(articleCategories);

      return !!affectedRows;
    } catch (error) {
      return logger.error(error);
    }
  }

  async delete(id) {
    const {Article} = this._db.models;

    try {
      const articleForDelete = await Article.findByPk(id, {raw: true});
      const deletedRows = await Article.destroy({
        returning: true,
        where: {
          id,
        }
      });

      if (!deletedRows) {
        return null;
      }

      return articleForDelete;
    } catch (error) {
      this._logger.error(`Can not delete article. Error: ${error}`);

      return null;
    }
  }
}

module.exports = ArticleService;
