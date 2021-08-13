'use strict';

const {getLogger} = require(`../../lib/logger`);
const packageJsonFile = require(`../../../package.json`);

const logger = getLogger({
  name: `api-version`,
});

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(version);
  }
};
