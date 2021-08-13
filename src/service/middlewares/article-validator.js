'use strict';

const schema = require(`../schemas/article`);

const {HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
