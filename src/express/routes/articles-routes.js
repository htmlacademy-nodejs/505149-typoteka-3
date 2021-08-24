'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);

const {getLogger} = require(`../../lib/logger`);
const {ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/upload`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

const articlesRouter = new Router();

const logger = getLogger({
  name: `articles-routes`,
});

articlesRouter.get(`/add`, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`new-post`, {
    DateTimeFormat,
    title: `Публикация`,
    categories,
    error,
    user
  });
});

articlesRouter.post(`/add`, upload.single(`file-picture`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : res.redirect(`/articles/add?error=There is no file was selected.`),
    announce: body.announce,
    fulltext: body.fulltext,
    title: body[`title`],
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err.message);
    res.redirect(`/articles/add?error=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories(false);

  res.render(`all-categories`, {title: `Категории`, categories, user});
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticlesByCategory({limit, offset, id}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`articles-by-category`, {
    title: `Посты по категории`,
    categories,
    articles,
    id,
    DateTimeFormat,
    page,
    totalPages,
    user
  });
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {error} = req.query;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true)
    ]);

    const sortedComments = article.comments.slice().sort((a, b) => (new Date(b[`created_date`])) - (new Date(a[`created_date`])));
    res.render(`post`, {
      DateTimeFormat,
      categories,
      article,
      id,
      title: `Пост`,
      sortedComments,
      error,
      user
    });
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {error} = req.query;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(false)
    ]);

    res.render(`new-post`, {
      article,
      DateTimeFormat,
      categories,
      id,
      title: `Публикация`,
      error,
      user
    });
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`file-picture`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announce,
    fulltext: body.fulltext,
    title: body[`title`],
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err.message);
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.post(`/:id/comments`, upload.single(`text`), async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {text} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    logger.error(error.message);
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
