'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({
  name: `api-server`,
});

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const article = service.findOne(articleId);

  if (!article) {
    logger.error(`Did not find article with ${articleId}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = article;
  return next();
};
