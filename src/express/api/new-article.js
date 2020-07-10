'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../lib/logger`);

const logger = getLogger();

const HOST = process.env.HOST || `http://localhost:3000/`;

const postArticle = async (article) => {
  try {
    const {data: response} = await axios({
      method: `post`,
      url: `${HOST}api/articles`,
      data: article
    });
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = postArticle;
