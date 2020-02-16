'use strict';

const chalk = require(`chalk`);
const Intl = require(`intl`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const MOCK_DATA = require(`../../../src/mock-data.json`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TimeConstants = {
  MS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
  DAYS_LIMIT: 90,
};

const DateRestrict = {
  min: Date.now() - TimeConstants.SECONDS * TimeConstants.MINUTES * TimeConstants.HOURS * TimeConstants.DAYS_LIMIT * TimeConstants.MS,
  max: Date.now(),
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: MOCK_DATA.titles[getRandomInt(0, MOCK_DATA.titles.length - 1)],
    announce: shuffle(MOCK_DATA.sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(MOCK_DATA.sentences).slice(0, getRandomInt(1, MOCK_DATA.sentences.length - 1)).join(` `),
    createdDate: new Intl.DateTimeFormat(`ru-Ru`, {day: `numeric`, month: `numeric`, year: `numeric`, hour: `numeric`, minute: `numeric`, second: `numeric`}).format(new Date(getRandomInt(DateRestrict.min, DateRestrict.max))),
    category: shuffle(MOCK_DATA.categories).slice(0, getRandomInt(1, MOCK_DATA.categories.length - 1)),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer), null, 2);

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
