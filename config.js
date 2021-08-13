'use strict';

require(`dotenv`).config();

module.exports = {
  APP_URL: process.env.APP_URL || `http://localhost`,
  APP_PORT: process.env.APP_PORT || 8080,
  API_PORT: process.env.API_PORT || 3000,
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || `typoteka_blog`,
  TEST_DB_NAME: process.env.TEST_DB_NAME || `test_typoteka_blog`,
  DB_USER: process.env.DB_USER || `typoteka`,
  DB_HOST: process.env.DB_HOST || `localhost`,
  DB_DIALECT: process.env.DB_DIALECT || `postgres`,
  DB_PASSWORD: process.env.DB_PASSWORD,
  TEST_DB_PASSWORD: process.env.TEST_DB_PASSWORD,
};
