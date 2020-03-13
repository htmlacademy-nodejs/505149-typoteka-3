'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my`, {title: `Мои публикации`}));
myRouter.get(`/comments`, (req, res) => res.render(`comments`, {title: `Комментарии`}));

module.exports = myRouter;
