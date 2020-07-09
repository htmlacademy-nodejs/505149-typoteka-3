'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../lib/logger`);
const {getRandomInt, shuffle} = require(`../../utils`);

const {MAX_ID_LENGTH} = require(`../../../src/constants`);
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const TXT_FILES_DIR = `./data/`;

const logger = getLogger();

const TimeConstants = {
  MS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
  DAYS_LIMIT: 90,
};

const makeMockData = async (files) => {
  let mockData = {};
  try {
    for (const file of files) {
      const fileName = file.split(`.`)[0];
      const data = await readContent(fileName);
      mockData[fileName] = data;
    }
    return mockData;
  } catch (error) {
    logger.error(error);
    return mockData;
  }
};

const readContent = async (fileName) => {
  try {
    const content = await fs.readFile(`./data/${fileName}.txt`, `utf8`);
    const contentArray = content.split(`\n`);
    contentArray.pop();
    return contentArray;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const DateRestrict = {
  min: Date.now() - TimeConstants.SECONDS * TimeConstants.MINUTES * TimeConstants.HOURS * TimeConstants.DAYS_LIMIT * TimeConstants.MS,
  max: Date.now(),
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    date: new Date(getRandomInt(DateRestrict.min, DateRestrict.max)).toISOString(),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, mockData) => {
  const array = Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    announce: shuffle(mockData.sentences).slice(0, getRandomInt(1, 3)).join(` `),
    fullText: shuffle(mockData.sentences).slice(0, getRandomInt(1, mockData.sentences.length - 1)).join(` `),
    createdDate: new Date(getRandomInt(DateRestrict.min, DateRestrict.max)).toISOString(),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 3)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments),
    picture: ``,
  }));

  for (const article of array) {
    article.comments.forEach((comment) => {
      comment.articleId = article.id;
    });
  }

  return array;
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, mockData), null, 2);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
