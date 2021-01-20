'use strict';

class ArticleService {
  constructor(db, logger) {
    this._db = db;
    this._logger = logger;
  }

  async findAll() {
    const {Article} = this._db.models;

    try {
      const articles = await Article.findAll({
        order: [
          [`created_date`, `DESC`],
        ]
      });
      const preparedArticles = [];

      for (const article of articles) {
        const categories = await article.getCategories({raw: true});
        const comments = await article.getComments({raw: true});
        article.dataValues.category = categories;
        article.dataValues.comments = comments;
        preparedArticles.push(article.dataValues);
      }

      return preparedArticles;
    } catch (error) {
      this._logger.error(`Can not find articles. Error: ${error}`);

      return [];
    }
  }

  async findPage({limit, offset}) {
    const {Article} = this._db.models;

    try {
      const {count, rows} = await Article.findAndCountAll({
        limit,
        offset,
        order: [
          [`created_date`, `DESC`],
        ]
      });
      const articles = [];

      for (const article of rows) {
        const categories = await article.getCategories({raw: true});
        const comments = await article.getComments({raw: true});
        article.dataValues.category = categories;
        article.dataValues.comments = comments;
        articles.push(article.dataValues);
      }
      return {count, articles};
    } catch (error) {
      this._logger.error(`Can not find articles. Error: ${error}`);

      return null;
    }
  }

  async findOne(id) {
    const {Article} = this._db.models;
    const articleId = Number.parseInt(id, 10);

    try {
      const article = await Article.findByPk(articleId);
      const comments = await article.getComments({raw: true});
      const categories = await article.getCategories({raw: true});
      article.dataValues.category = categories;
      article.dataValues.comments = comments;

      return article.dataValues;
    } catch (error) {
      this._logger.error(`Can not find article. Error: ${error}`);

      return null;
    }
  }

  async findByCategory(id) {
    const categoryId = Number.parseInt(id, 10);
    const articles = await this.findAll();
    return articles.filter((article) => article.category.find((category) => category.id === categoryId));
  }

  async create(article) {
    const {sequelize} = this._db;
    const {Category, Article, User} = this._db.models;
    const allCategories = await Category.findAll({raw: true});
    const categoriesIds = allCategories.reduce((acc, item) => {
      if (article.category.filter((cat) => cat === item.title).length) {
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
      if (article.category.filter((cat) => cat === item.title).length) {
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
