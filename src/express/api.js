'use strict';

const axios = require(`axios`).default;

const {API_PORT, APP_URL} = require(`../../config`);
const {TIMEOUT} = require(`../constants`);

const defaultUrl = `${APP_URL}:${API_PORT}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  search({offset, limit, query}) {
    return this._load(`/search`, {params: {offset, limit, query}});
  }

  async getCategories(needCount) {
    return this._load(`/categories`, {params: {needCount}});
  }

  // async getArticlesByCategory(id) {
  //   const {data: articles} = await axios.get(`${this._baseUrl}categories/${id}`);
  //   return articles;
  // }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  // async getComments(id) {
  //   const {data: comments} = await axios.get(`${this._baseUrl}articles/${id}/comments`);
  //   return comments;
  // }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
