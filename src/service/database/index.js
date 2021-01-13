'use strict';

const Sequelize = require(`sequelize`);

const {getLogger} = require(`../../lib/logger`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT} = require(`../../../config`);

const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

const logger = getLogger({
  name: `db-server`,
});

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000
  }
});

module.exports = {
  sequelize,
};
