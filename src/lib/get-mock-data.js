'use strict';

const fs = require(`fs`).promises;

const {getLogger} = require(`./logger`);

const {FILE_NAME} = require(`../constants`);

const logger = getLogger({
  name: `api-server-make-mock-data`,
});

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
  }

  return data;
};

module.exports = getMockData;
