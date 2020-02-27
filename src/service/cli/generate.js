'use strict';

const chalk = require(`chalk`);
const Intl = require(`intl`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const TXT_FILES_DIR = `./data/`;

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
    console.error(chalk.red(error));
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
    console.error(chalk.red(err));
    return [];
  }
};

const DateRestrict = {
  min: Date.now() - TimeConstants.SECONDS * TimeConstants.MINUTES * TimeConstants.HOURS * TimeConstants.DAYS_LIMIT * TimeConstants.MS,
  max: Date.now(),
};

const generateOffers = (count, mockData) => (
  Array(count).fill({}).map(() => ({
    title: mockData.titles[getRandomInt(0, mockData.titles.length - 1)],
    announce: shuffle(mockData.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(mockData.sentences).slice(0, getRandomInt(1, mockData.sentences.length - 1)).join(` `),
    createdDate: new Intl.DateTimeFormat(`ru-Ru`, {day: `numeric`, month: `numeric`, year: `numeric`, hour: `numeric`, minute: `numeric`, second: `numeric`}).format(new Date(getRandomInt(DateRestrict.min, DateRestrict.max))),
    category: shuffle(mockData.categories).slice(0, getRandomInt(1, mockData.categories.length - 1)),
  }))
);

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
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
