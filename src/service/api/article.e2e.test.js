'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const {sequelize} = require(`../database`);
const {HttpCode, ExitCode} = require(`../../constants`);

const mockArticle = {
  "title": `Title`,
  "announce": `Some text`,
  "fulltext": `Some very long text`,
  "categories": [
    `Программирование`,
  ],
  "picture": `forest@2x.jpg`,
};

let app = null;
let res;
let newId;
let newCommentId;

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

describe(`Article API end-points:`, () => {
  test(`status code of GET article query should be 200`, async () => {
    res = await request(app).get(`/api/articles`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/articles`);
    expect(res.body.articles.length).toBeGreaterThan(0);
    expect(res.body.count).toBeGreaterThan(0);
    expect(Array.isArray(res.body.articles)).toBeTruthy();
  });

  test(`status code for wrong GET article request should be 404`, async () => {
    res = await request(app).get(`/api/articles/xx`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code for POST article request should be 201`, async () => {
    res = await request(app)
      .post(`/api/articles`)
      .send(mockArticle);
    newId = res.body.id;

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for incorrect POST article query should be 400`, async () => {
    res = await request(app)
      .post(`/api/articles`)
      .send({"some": `some`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`status code for GET article query by id should be 200`, async () => {
    res = await request(app).get(`/api/articles/${newId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`PUT request should work and status code  should be 200`, async () => {
    res = await request(app)
      .put(`/api/articles/${newId}`)
      .send({
        "title": `New title`,
        "announce": `Some text`,
        "fulltext": `Some very long text`,
        "categories": [
          `Программирование`,
        ],
        "picture": `forest@2x.jpg`,
      });
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.title).toBe(`New title`);
  });

  test(`wrong PUT request should not work and status code  should be 400`, async () => {
    res = await request(app)
      .put(`/api/articles/${newId}`)
      .send({
        "title": `Title`,
      });
    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`DELETE article request should work and status code after deleting should be 200`, async () => {
    res = await request(app).delete(`/api/articles/${newId}`);
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get(`/api/articles`);
  });

  test(`status for incorrect DELETE article request should be 404`, async () => {
    res = await request(app).delete(`/api/articles/xx`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});

describe(`Article comments API end-points`, () => {
  test(`status code after POST comment request should be 201`, async () => {
    res = await request(app)
      .post(`/api/articles`)
      .send(mockArticle);
    newId = res.body.id;

    res = await request(app)
      .post((`/api/articles/${newId}/comments`))
      .send({
        "text": `Some text`,
      });
    newCommentId = res.body.id;

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code after GET request for comments should be 200 and `, async () => {
    res = await request(app).get((`/api/articles/${newId}/comments`));

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET for comments should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/articles/${newId}/comments`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`status code after request of comments with wrong article id should be 404`, async () => {
    res = await request(app).get((`/api/articles/xx/comments`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code after wrong POST request of comment should be 400`, async () => {
    res = await request(app)
      .post((`/api/articles/${newId}/comments`))
      .send({
        "some": `Some`,
      });

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`delete comment request should delete comment and status code after should be 200`, async () => {
    res = await request(app).delete((`/api/articles/${newId}/comments/${newCommentId}`));
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get((`/api/articles/${newId}/comments`));
    expect(res.body.length).toBe(0);
  });

  test(`status code after delete comment request with wrong comment id should return 404`, async () => {
    res = await request(app).delete((`/api/articles/${newId}/comments/xx`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
