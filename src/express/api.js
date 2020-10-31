'use strict';

const axios = require(`axios`).default;

const {getLogger} = require(`../lib/logger`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const logger = getLogger({
  name: `api-axios`,
});

class API {
  constructor(baseUrl, timeout) {
    this._baseUrl = baseUrl;
    this._timeout = timeout;
  }

  async getArticles() {
    const {data: articles} = await axios.get(`${this._baseUrl}articles`);
    return articles;
  }

  async getArticle(id) {
    const {data: article} = await axios.get(`${this._baseUrl}articles/${id}`);
    return article;
  }

  async search(query) {
    try {
      const {data: articles} = await axios.get(`${this._baseUrl}search?query=${query}`);
      return articles;
    } catch (error) {
      return logger.error(`Error while search: ${error.message}`);
    }
  }

  async getCategories() {
    const {data: categories} = await axios.get(`${this._baseUrl}categories`);
    return categories;
  }

  async getArticlesByCategory(id) {
    const {data: articles} = await axios.get(`${this._baseUrl}categories/${id}`);
    return articles;
  }

  async createArticle(data) {
    const {data: article} = await axios({
      method: `post`,
      url: `${this._baseUrl}articles`,
      data
    });
    return article;
  }

  async getComments(id) {
    const {data: comments} = await axios.get(`${this._baseUrl}articles/${id}/comments`);
    return comments;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
