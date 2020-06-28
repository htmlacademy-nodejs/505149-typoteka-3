'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger();

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const offer = service.findOne(articleId);

  if (!offer) {
    logger.error(`Did not found article with ${articleId}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${articleId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
