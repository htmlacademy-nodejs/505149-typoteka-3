'use strict';

const fs = require(`fs`).promises;

const {getLogger} = require(`./lib/logger`);

const logger = getLogger({
  name: `api-server-utils`,
});

const TimeConstants = {
  MS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
  DAYS_LIMIT: 90,
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

module.exports = {
  TimeConstants,
  DateRestrict: {
    min: Date.now() - TimeConstants.SECONDS * TimeConstants.MINUTES * TimeConstants.HOURS * TimeConstants.DAYS_LIMIT * TimeConstants.MS,
    max: Date.now(),
  },
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  shuffle: (someArray) => {
    for (let i = someArray.length - 1; i > 0; i--) {
      const randomPosition = Math.floor(Math.random() * i);
      [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
    }
    return someArray;
  },
  readContent,
  makeMockData: async (files) => {
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
  }
};
