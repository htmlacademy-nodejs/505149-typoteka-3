'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`category`, `announce`, `title`, `fulltext`, `picture`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const entries = Object.entries(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));
  for (const entry of entries) {
    if (entry[0] === `category` && !entry[1].length || entry[1] === ``) {
      return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    }
  }

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
