'use strict';

const request = require(`supertest`);

const {createApp} = require(`../cli/server`);
const sequelize = require(`../database/sequelize`);
const {HttpCode, ExitCode} = require(`../../constants`);

const mockArticle = {
  "title": `Title`,
  "announce": `Some text`,
  "fulltext": `Some very long text`,
  "categories": [2, 7],
  "picture": `forest@2x.jpg`,
  "userId": 1
};

let app = null;
let newId;
let newCommentId;

beforeAll(async () => {
  try {
    app = await createApp();
  } catch (error) {
    process.exit(ExitCode.error);
  }
});

afterAll(() => {
  sequelize.close();
});

describe(`Article API end-points:`, () => {
  let res;

  test(`status code of GET article query should be 200`, async () => {
    res = await request(app).get(`/api/articles`);
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after GET should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/articles`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`output after GET articles with limit and offset should have an array with at least length 1`, async () => {
    res = await request(app).get(`/api/articles`).query({limit: 8, offset: 0, comments: false});

    expect(res.body.articles.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.articles)).toBeTruthy();
  });

  test(`output after GET articles with limit and offset should have count of articles`, async () => {
    res = await request(app).get(`/api/articles`).query({limit: 8, offset: 0, comments: false});

    expect(res.body.count).toBeGreaterThan(0);
  });

  test(`status code for wrong GET article request should be 404`, async () => {
    res = await request(app).get(`/api/articles/999999`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code for POST article request should be 201`, async () => {
    res = await request(app)
      .post(`/api/articles`)
      .send(mockArticle);
    newId = res.body.id;

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`status code for GET article query by id should be 200`, async () => {
    res = await request(app).get(`/api/articles/${newId}`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status code for GET articles with comments should be 200`, async () => {
    res = await request(app).get(`/api/articles`).query({comments: true});

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`output after GET articles with comments should have array with comments (at least 0, should be array)`, async () => {
    res = await request(app).get(`/api/articles`).query({comments: true});

    expect(Array.isArray(res.body[0].comments)).toBeTruthy();
  });

  test(`PUT request should work and status code  should be 200`, async () => {
    res = await request(app)
      .put(`/api/articles/${newId}`)
      .send({
        "title": `New title`,
        "announce": `Some text`,
        "fulltext": `Some very long new text`,
        "categories": [2, 5],
        "picture": `forest@2x.jpg`,
        "userId": 1
      });
    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`output after PUT request should have updated fields`, async () => {
    res = await request(app)
      .get(`/api/articles/${newId}`);

    expect(res.body.title).toBe(`New title`);
    expect(res.body.fulltext).toBe(`Some very long new text`);
    expect(res.body.categories[1].id).toBe(5);
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
  });

  test(`status for incorrect DELETE article request should be 500`, async () => {
    res = await request(app).delete(`/api/articles/999999`);

    expect(res.statusCode).toBe(HttpCode.INTERNAL_SERVER_ERROR);
  });

  test(`status code after GET articles by given category should be 200`, async () => {
    res = await request(app).get(`/api/articles/category/1`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`GET request for articles by given category should return array of articles and count`, async () => {
    res = await request(app).get(`/api/articles/category/1`);

    expect(Array.isArray(res.body.articles)).toBeTruthy();
    expect(res.body.articles.length).toBeGreaterThan(0);
    expect(res.body.count).toBeGreaterThan(0);
  });
});

describe(`Article comments API end-points`, () => {
  let res;

  test(`status code after GET request for comments should be 200`, async () => {
    res = await request(app).post(`/api/articles`).send(mockArticle);

    newId = res.body.id;
    res = await request(app).get((`/api/articles/${newId}/comments`));

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`status code after request of comments with wrong offer id should be 404`, async () => {
    res = await request(app).get((`/api/articles/1000/comments`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  test(`status code after POST comment request should be 201`, async () => {
    res = await request(app)
      .post(`/api/articles/${newId}/comments`)
      .send({
        "text": `Это новый очень хороший комментарий!`,
        "userId": 1
      });

    expect(res.statusCode).toBe(HttpCode.CREATED);
  });

  test(`output after GET for comments should be an array with at least length 1`, async () => {
    res = await request(app).get(`/api/articles/${newId}/comments`);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test(`status code after request of comments with wrong article id should be 404`, async () => {
    res = await request(app).get((`/api/articles/99999/comments`));

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
    res = await request(app)
    .post((`/api/articles/${newId}/comments`))
    .send({
      "text": `Это еще новый очень хороший комментарий!`,
      "userId": 2
    });
    newCommentId = res.body.id;

    res = await request(app).delete((`/api/articles/${newId}/comments/${newCommentId}`));
    expect(res.statusCode).toBe(HttpCode.OK);

    res = await request(app).get((`/api/articles/${newId}/comments`));
    expect(res.body.length).toBe(1);
  });

  test(`status code after delete comment request with wrong comment id should return 404`, async () => {
    res = await request(app).delete((`/api/articles/${newId}/comments/99999`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
