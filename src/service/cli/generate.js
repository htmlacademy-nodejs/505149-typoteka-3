'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../lib/logger`);
const {getRandomInt, shuffle, DateRestrict, makeMockData} = require(`../../utils`);

const {
  MAX_ID_LENGTH,
  TXT_FILES_DIR,
  MAX_DATA_COUNT,
  DEFAULT_COUNT,
  MAX_COMMENTS,
  FILE_NAME,
  ExitCode
} = require(`../../../src/constants`);

const logger = getLogger({
  name: `api-generate`,
});

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    date: new Date(getRandomInt(DateRestrict.min, DateRestrict.max)).toISOString(),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, mockData) => {
  const array = Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    announce: shuffle(mockData.sentences).slice(0, getRandomInt(1, 3)).join(` `),
    fulltext: shuffle(mockData.sentences).slice(0, getRandomInt(1, mockData.sentences.length - 1)).join(` `),
    [`created_date`]: new Date(getRandomInt(DateRestrict.min, DateRestrict.max)).toISOString(),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 3)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), mockData.comments),
    picture: `sea-fullsize@1x.jpg`,
  }));

  for (const article of array) {
    article.comments.forEach((comment) => {
      comment[`article_id`] = article.id;
    });
  }

  return array;
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    if (count >= MAX_DATA_COUNT) {
      logger.error(`Не больше 1000 постов`);
      process.exit(ExitCode.error);
    }
    const files = await fs.readdir(TXT_FILES_DIR);
    const mockData = await makeMockData(files);

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticles, mockData), null, 2);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(`Operation success. File created.`);
    } catch (err) {
      logger.error(`Can't write data to file...`);
    }
  }
};
