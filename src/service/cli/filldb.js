'use strict';

const fs = require(`fs`).promises;

const {sequelize, models} = require(`../database`);
const {getLogger} = require(`../../lib/logger`);
const {getRandomInt, shuffle, makeMockData} = require(`../../utils`);

const {TXT_FILES_DIR, ExitCode} = require(`../../constants`);
const DEFAULT_COUNT = 5;
const MAX_COMMENTS = 50;

const users = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `arteta@gmail.com`,
    password: `qwertyss`,
    avatar: `image.jpg`,
  },
  {
    firstName: `Сергей`,
    lastName: `Сидоров`,
    email: `barguzin@gmail.com`,
    password: `qwertyss`,
    avatar: `image2.jpg`,
  }
];

const logger = getLogger({
  name: `api-server`,
});

const generateCategories = (categories) => (
  categories.map((item) => ({
    title: item,
    picture: `picture.png`,
  }))
);

const generateComments = (comments, countOfArticles) => (
  Array(MAX_COMMENTS).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    [`user_id`]: getRandomInt(1, 2),
    [`article_id`]: getRandomInt(1, countOfArticles),
  }))
);

const generateArticles = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    announce: shuffle(mockData.sentences).slice(0, getRandomInt(1, 3)).join(` `),
    fulltext: shuffle(mockData.sentences).slice(0, getRandomInt(1, mockData.sentences.length - 1)).join(` `),
    picture: `sea-fullsize@2x.jpg`,
    category: shuffle(mockData.categories).slice(1, getRandomInt(1, mockData.categories.length - 1)),
    [`user_id`]: getRandomInt(1, 2),
  }))
);

const fillDataBase = async (categories, comments, articles) => {
  try {
    await Promise.all([
      models.User.bulkCreate(users),
      models.Category.bulkCreate(categories)
    ]);

    await models.Article.bulkCreate(articles);
    await models.Comment.bulkCreate(comments);

    const rawCategories = await models.Category.findAll({raw: true});

    for (const article of articles) {
      const categoriesIds = rawCategories.reduce((acc, item) => {
        if (article.category.filter((cat) => cat === item.title).length) {
          acc.push(item.id);
        }
        return acc;
      }, []);

      const articleCategories = await models.Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        }
      });

      const rawArticle = await models.Article.findOne({
        where: {
          title: article.title,
        }
      });
      await rawArticle.addCategories(articleCategories);
    }
  } catch (error) {
    logger.error(`An error occured while filling database: ${error.message}`);
    throw new Error(`${error.message}`);
  }

};

module.exports = {
  name: `--filldb`,
  async run(args) {
    let count;
    try {
      const files = await fs.readdir(TXT_FILES_DIR);
      if (args) {
        [count] = args;
      }
      const countOfArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
      const mockData = await makeMockData(files);
      const categories = generateCategories(mockData.categories);
      const comments = generateComments(mockData.comments, countOfArticles);
      const articles = generateArticles(countOfArticles, mockData);

      logger.info(`Trying to connect to database...`);
      const result = await sequelize.sync({force: true});
      logger.info(`Successfully created ${result.config.database} database`);

      await fillDataBase(categories, comments, articles);
      logger.info(`Successfully filled ${result.config.database} database`);
      sequelize.close();

    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.error);
    }
  }
};

// убрал каунт
