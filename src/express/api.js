'use strict';

const axios = require(`axios`).default;

const {API_PORT, APP_URL} = require(`../../config`);
const {TIMEOUT, HttpMethod} = require(`../constants`);

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
      method: HttpMethod.PUT,
      data
    });
  }

  search({offset, limit, query}) {
    return this._load(`/search`, {params: {offset, limit, query}});
  }

  async getCategories(needCount) {
    return this._load(`/categories`, {params: {needCount}});
  }

  async getArticlesByCategory({id, offset, limit}) {
    return this._load(`/articles/category/${id}`, {params: {offset, limit}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
