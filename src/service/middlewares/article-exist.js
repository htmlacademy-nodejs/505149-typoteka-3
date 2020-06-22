'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const offer = service.findOne(articleId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${articleId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
