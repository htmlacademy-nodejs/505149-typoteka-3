'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const {getLogger} = require(`../../lib/logger`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/upload`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

const logger = getLogger({
  name: `main-routes`,
});

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const allArticles = await api.getArticles({comments: true});

  try {
    const [{count, articles}, categories] = await Promise.all([
      api.getArticles({limit, offset, comments: true}),
      api.getCategories(true)
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    const sortedByQtyOfComments = allArticles.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 4);
    const sortedByDateComments = (await getSortedByDateComments(allArticles)).slice(0, 4);

    return res.render(`main`, {
      articles,
      sortedByQtyOfComments,
      title: `Типотека`,
      DateTimeFormat,
      sortedByDateComments,
      categories,
      page,
      totalPages,
      user
    });
  } catch (error) {
    logger.error(error.message);
    return res.render(`errors/500`, {title: `Ошибка сервера`});
  }
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  res.render(`registration`, {errors: error && error.split(`,`), user});
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file.filename,
    firstName: body[`name`],
    lastName: body[`surname`],
    email: body[`user-email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    res.redirect(`/register?error=${encodeURIComponent(error.response.data)}`);
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  res.render(`login`, {error, user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    req.session.user = await api.auth(req.body[`user-email`], req.body[`user-password`]);
    req.session.save(() => res.redirect(`/`));
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.response.data)}`);
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => res.redirect(`/`));
});

module.exports = mainRouter;
