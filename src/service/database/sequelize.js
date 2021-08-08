'use strict';

const Sequelize = require(`sequelize`);

const {getLogger} = require(`../../lib/logger`);
const {DB_NAME, TEST_DB_NAME, DB_USER, DB_PASSWORD, TEST_DB_PASSWORD, DB_PORT, DB_HOST, DB_DIALECT} = require(`../../../config`);
const {Env} = require(`../../constants`);

const isTestMode = process.env.NODE_ENV === Env.TEST;

const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

const logger = getLogger({
  name: `sequelize`,
});

const dbName = isTestMode ? TEST_DB_NAME : DB_NAME;
const dbPswd = isTestMode ? TEST_DB_PASSWORD : DB_PASSWORD;
const loggingMode = isTestMode ? false : (msg) => logger.debug(msg);

module.exports = new Sequelize(
    dbName, DB_USER, dbPswd, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: DB_DIALECT,
      logging: loggingMode,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
