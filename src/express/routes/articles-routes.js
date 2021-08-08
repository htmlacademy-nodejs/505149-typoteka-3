'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../lib/logger`);
// const {dateToTime} = require(`../../lib/utils`);
const {ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;

const articlesRouter = new Router();

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger({
  name: `articles-routes`,
});

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {DateTimeFormat, title: `Публикация`, categories});
});

articlesRouter.post(`/add`, upload.single(`file-picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file.filename,
    announce: body.announce,
    fulltext: body.fulltext,
    title: body[`title`],
    categories: ensureArray(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories(false);

  res.render(`all-categories`, {title: `Категории`, categories});
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const categoryId = Number.parseInt(id, 10);
  const categories = await api.getCategories();
  const selectedCategory = categories.find((it) => it.id === categoryId);
  const articlesByCategory = await api.getArticlesByCategory(categoryId);

  if (articlesByCategory.length) {
    res.render(`articles-by-category`, {title: `Статьи по категории`, categories, selectedCategory, articlesByCategory, id, DateTimeFormat});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`, msg: `Нет статей такой категории`});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true)
    ]);

    const sortedComments = article.comments.slice().sort((a, b) => (new Date(b[`created_date`])) - (new Date(a[`created_date`])));
    res.render(`post`, {DateTimeFormat, categories, article, id, title: `Пост`, sortedComments});
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const categories = await api.getCategories();
  const article = await api.getArticle(id);
  if (categories.length === 0) {
    categories = await api.getCategories();
  }

  if (article) {
    res.render(`new-post`, {article, DateTimeFormat, title: `Публикация`, categories});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = articlesRouter;
