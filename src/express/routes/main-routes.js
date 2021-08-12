'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getSortedByDateComments} = require(`../../lib/utils`);
const {getLogger} = require(`../../lib/logger`);
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

const logger = getLogger({
  name: `main-routes`,
});

mainRouter.get(`/`, async (req, res) => {
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
    });
  } catch (error) {
    logger.error(error.message);
    return res.render(`errors/500`, {title: `Ошибка сервера`});
  }
});

mainRouter.get(`/registration`, (req, res) => res.render(`registration`, {title: `Регистрация`}));

mainRouter.get(`/login`, (req, res) => res.render(`login`, {title: `Войти`}));

module.exports = mainRouter;
