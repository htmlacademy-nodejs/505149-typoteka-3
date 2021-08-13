'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  categories: Joi.array()
    .items(Joi.number()
      .integer()
      .positive())
    .min(1)
    .required(),

  title: Joi.string()
    .min(10)
    .max(100)
    .required(),

  announce: Joi.string()
    .min(50)
    .max(500)
    .required(),

  fulltext: Joi.string()
    .min(50)
    .max(5000)
    .required(),

  picture: Joi.string()
    .required(),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
});
