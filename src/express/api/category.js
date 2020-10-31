'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({
  name: `api-axios`,
});

const HOST = process.env.HOST || `http://localhost:3000/`;

const getArticlesByCategory = async (id) => {
  try {
    const {data: response} = await axios.get(`${HOST}api/categories/${id}`);
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getArticlesByCategory;
