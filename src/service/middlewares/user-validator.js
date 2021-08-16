'use strict';

const schema = require(`../schemas/user`);

const {HttpCode, RegisterMessage} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;

  try {
    await schema.validateAsync(newUser, {abortEarly: false});
  } catch (err) {
    return res.status(HttpCode.BAD_REQUEST)
    .send(err.details.map((error) => error.message));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(RegisterMessage.USER_ALREADY_REGISTER);
  }

  return next();
};
