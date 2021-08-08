'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliases`);
// const {getLogger} = require(`../../lib/logger`);

// const logger = getLogger({
//   name: `data-service-article`
// });

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

  async create(article) {
    const {sequelize} = this._db;
    const {Category, Article, User} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (article.categories.filter((cat) => cat === item.title).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const articleCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });

      const user = await User.findByPk(1);
      const newArticle = await user.createArticle(article);
      await newArticle.addCategories(articleCategories);

      return await Article.findByPk(newArticle.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create article. Error: ${error}`);

      return null;
    }
  }

  async update(id, article) {
    const {sequelize} = this._db;
    const {Article, Category} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (article.categories.filter((cat) => cat === item.title).length) {
        acc.push(item.id);
      }
      return acc;
    }, []);

    try {
      const [rows] = await Article.update(article, {
        where: {
          id,
        }
      });

      if (!rows) {
        return null;
      }

      const updatedArticle = await Article.findByPk(id);
      const articleCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });
      await updatedArticle.addCategories(articleCategories);
      return await Article.findByPk(updatedArticle.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not update article. Error: ${error}`);

      return null;
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
