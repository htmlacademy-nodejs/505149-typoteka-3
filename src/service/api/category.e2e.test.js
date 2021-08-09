'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const sequelize = require(`../database/sequelize`);
const {HttpCode, ExitCode} = require(`../../constants`);

describe(`Categories API end-points:`, () => {
  let app = null;
  let res;

  beforeAll(async () => {
    try {
      app = await createApp();
      res = await request(app).get(`/api/categories`);
    } catch (error) {
      process.exit(ExitCode.error);
    }
  });

  afterAll(() => {
    sequelize.close();
  });

  test(`status code of get query should be 200`, async () => {
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output should have at least one category`, async () => {
    expect(res.body.length).toBeGreaterThan(0);
  });

  test(`returns list of 9 categories`, () => expect(res.body.length).toBe(9));

  test(`each item's title of output have to be string`, () => {
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.every((it) => typeof it.title === `string`)).toBeTruthy();
  });
});
