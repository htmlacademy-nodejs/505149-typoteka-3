'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../lib/logger`);

const logger = getLogger();

const HOST = process.env.HOST || `http://localhost:3000/`;

const getArticle = async (id) => {
  try {
    const {data: response} = await axios.get(`${HOST}api/articles/${id}`);
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getArticle;
