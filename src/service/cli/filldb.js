'use strict';

const fs = require(`fs`).promises;

const sequelize = require(`../database/sequelize`);
const {getLogger} = require(`../../lib/logger`);
const initDatabase = require(`../database/init-db`);
const {getRandomInt, shuffle, makeMockData, readContent} = require(`../../utils`);

const {
  MAX_DATA_COUNT,
  TXT_FILES_DIR,
  DEFAULT_COUNT,
  MAX_COMMENTS,
  ExitCode
} = require(`../../constants`);

const users = [
  {
    name: `Иван Иванов`,
    email: `arteta@gmail.com`,
    passwordHash: `qwertyss`,
    avatar: `image.jpg`,
  },
  {
    name: `Сергей Сидоров`,
    email: `barguzin@gmail.com`,
    passwordHash: `qwertyss`,
    avatar: `image2.jpg`,
  }
];

const logger = getLogger({
  name: `api-filldb`,
});

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

const generateArticles = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    announce: shuffle(mockData.sentences).slice(0, getRandomInt(1, 3)).join(` `),
    fulltext: shuffle(mockData.sentences).slice(0, getRandomInt(1, mockData.sentences.length - 1)).join(` `),
    picture: `sea-fullsize@2x.jpg`,
    categories: shuffle(mockData.categories).slice(1, getRandomInt(1, mockData.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [count] = args;
    if (count >= MAX_DATA_COUNT) {
      logger.error(`Не больше 1000 постов`);
      process.exit(ExitCode.error);
    }

    const countOfArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);
    const categories = await readContent(`categories`);
    const articles = generateArticles(countOfArticles, mockData);

    return initDatabase(sequelize, {articles, categories, users});
  }
};
