'use strict';

const fs = require(`fs`).promises;
const {DateTimeFormat} = require(`intl`);

const {getLogger} = require(`../../lib/logger`);
const {getRandomInt, shuffle, makeMockData, DateRestrict} = require(`../../utils`);
const {TXT_FILES_DIR} = require(`../../constants`);

const logger = getLogger({
  name: `api-server-sql`,
});

const FILE_NAME = `fill-db.sql`;
const DEFAULT_COUNT = 3;

const createCategories = (categories) => {
  let result = ``;
  let id = 1;
  categories.forEach((it) => {
    result = result + `(${id}, '${it}', 'picture.png'),\n`;
    id++;
  });
  return `${result.trim().slice(0, -1)};`;
};

const createArticles = (data, amount) => {
  let result = ``;
  for (let index = 1; index <= amount; index++) {
    result = result + `(${index}, '${data.titles[getRandomInt(0, data.titles.length - 1)]}', '${shuffle(data.sentences).slice(0, getRandomInt(1, 3)).join(` `)}', '${shuffle(data.sentences).slice(0, getRandomInt(1, data.sentences.length - 1)).join(` `)}', 'sea-fullsize@1x.jpg', '${`${new DateTimeFormat(`ru-RU`, {year: `numeric`, day: `numeric`, month: `numeric`}).format(new Date(getRandomInt(DateRestrict.min, DateRestrict.max)))}`}', ${getRandomInt(1, 2)}),\n`;
  }
  return `${result.trim().slice(0, -1)};`;
};

const createComments = (comments, amount) => {
  let result = ``;
  let id = 1;
  comments.forEach((it) => {
    result = result + `(${id}, '${it}', '${`${new DateTimeFormat(`ru-RU`, {year: `numeric`, day: `numeric`, month: `numeric`}).format(new Date(getRandomInt(DateRestrict.min, DateRestrict.max)))}`}', ${getRandomInt(1, 2)}, ${getRandomInt(1, amount)}),\n`;
    id++;
  });
  return `${result.trim().slice(0, -1)};`;
};

const createArticlesAndCategoriesRelations = (amount, categoriesQty) => {
  let result = ``;
  let id = 1;
  let set;
  for (let i = 0; i < categoriesQty; i++) {
    const articlesByCategoryQty = getRandomInt(1, amount);
    set = new Set();
    for (let k = 0; k < articlesByCategoryQty; k++) {
      set.add(`(${getRandomInt(1, amount)}, ${id}),\n`);
    }
    result = result + [...set].join(``);
    id++;
  }
  return `${result.trim().slice(0, -1)};`;
};

const makeFillSql = (amount, mockData) => {
  return `INSERT INTO users VALUES
(1, 'Иван', 'Иванов', 'asterix@gmail.com', 'qwertyasd', 'image.jpg'),
(2, 'Сергей', 'Сидоров', 'obelisk@gmail.com', 'qwertyasd', 'image2.jpg');

INSERT INTO categories VALUES
${createCategories(mockData.categories)}

INSERT INTO articles VALUES
${createArticles(mockData, amount)}

INSERT INTO comments VALUES
${createComments(mockData.comments, amount)}

INSERT INTO articles_categories VALUES
${createArticlesAndCategoriesRelations(amount, mockData.categories.length)}
`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [qty] = args;
    const amount = Number.parseInt(qty, 10) || DEFAULT_COUNT;
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);
    const content = makeFillSql(amount, mockData);
    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
