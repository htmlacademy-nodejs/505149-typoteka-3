'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../lib/logger`);
const {ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE, MAX_FILE_SIZE, ALLOWED_TYPES, MULTER_ERRORS} = require(`../../constants`);

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

const upload = multer({
  storage,
  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(MULTER_ERRORS.NOT_IMAGE), false);
    }
  }
});

articlesRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`new-post`, {DateTimeFormat, title: `Публикация`, categories, error});
});

articlesRouter.post(`/add`, upload.single(`file-picture`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file.filename,
    announce: body.announce,
    fulltext: body.fulltext,
    title: body[`title`],
    categories: ensureArray(body.category),
    // TODO: после внедрения user
    userId: 2
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`/articles/add?error=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories(false);

  res.render(`all-categories`, {title: `Категории`, categories});
});

articlesRouter.get(`/category/:id`, async (req, res) => {
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
    totalPages
  });
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true)
    ]);

    const sortedComments = article.comments.slice().sort((a, b) => (new Date(b[`created_date`])) - (new Date(a[`created_date`])));
    res.render(`post`, {DateTimeFormat, categories, article, id, title: `Пост`, sortedComments, error});
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
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
      error
    });
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`file-picture`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announce,
    fulltext: body.fulltext,
    title: body[`title`],
    categories: ensureArray(body.category),
    // TODO: после внедрения user
    userId: 1
  };

  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`/articles/add?error=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.post(`/:id/comments`, upload.single(`text`), async (req, res) => {
  const {id} = req.params;
  const {text} = req.body;

  // TODO: нужно будет поправить после внедрения user
  let comment = {};
  comment.userId = 1;
  comment.text = text;

  try {
    await api.createComment(id, comment);
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = articlesRouter;
