'use strict';

const {Router} = require(`express`);
const {DateTimeFormat} = require(`intl`);
const formidable = require(`formidable`);

const getArticle = require(`../api/article`);
const getCategories = require(`../api/categories`);
const getArticlesByCategory = require(`../api/category`);
const postArticle = require(`../api/new-article`);
const {getLogger} = require(`../../lib/logger`);
const {dateToTime} = require(`../../lib/utils`);

const articlesRouter = new Router();

const logger = getLogger({
  name: `front-server-formidable`,
});

let categories = [];

articlesRouter.get(`/add`, async (req, res) => {
  categories = await getCategories();
  res.render(`new-post`, {DateTimeFormat, title: `Публикация`, categories});
});

articlesRouter.post(`/add`, async (req, res) => {
  const allowedTypes = [`image/jpeg`, `image/png`];
  let isAllowedFormat;
  let article = {category: []};

  const formData = new formidable.IncomingForm({maxFileSize: 2 * 1024 * 1024});
  try {
    formData.parse(req)
      .on(`field`, (name, field) => {
        if (name === `category`) {
          article[name].push(field);
        } else {
          article[name] = field;
        }
      })
      .on(`fileBegin`, (name, file) => {
        if (!allowedTypes.includes(file.type)) {
          isAllowedFormat = false;
        } else {
          isAllowedFormat = true;
          file.path = process.cwd() + `/src/express/files/img/` + file.name;
        }
      })
      .on(`file`, (name, file) => {
        article.picture = file.path.match(/\/([^\/]+)\/?$/)[1];
      })
      .on(`aborted`, () => {
        logger.error(`Request aborted by the user.`);
      })
      .on(`error`, async (err) => {
        logger.error(`There is error while parsing form data. ${err}`);

        if (article.createdDate) {
          article.createdDate = new Date(dateToTime(`d.m.y`, article.createdDate)).toISOString();
        } else {
          article.createdDate = Date.now();
        }

        article.picture = ``;
        if (categories.length === 0) {
          categories = await getCategories();
        }

        res.render(`new-post`, {article, DateTimeFormat, title: `Публикация`, categories});
      })
      .on(`end`, async () => {
        if (!article.createdDate) {
          article.createdDate = new DateTimeFormat(`ru-Ru`, {day: `numeric`, month: `numeric`, year: `numeric`, hour: `numeric`, minute: `numeric`, second: `numeric`}).format(Date.now());
        }
        if (isAllowedFormat) {
          await postArticle(article);
          res.redirect(`/my`);
        } else {
          formData.emit(`error`, `Not correct file's extension.`);
        }
      });
  } catch (error) {
    logger.error(`Error happened: ${error}`);
  }
});

articlesRouter.get(`/categories`, async (req, res) => {
  categories = await getCategories();

  res.render(`all-categories`, {title: `Категории`, categories});
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  categories = await getCategories();
  const selectedCategory = categories[id - 1];
  const articlesByCategory = await getArticlesByCategory(id);

  res.render(`articles-by-category`, {title: `Статьи по категории`, categories, selectedCategory, articlesByCategory, id, DateTimeFormat});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getArticle(id);
  categories = await getCategories();

  res.render(`post`, {DateTimeFormat, article, title: `Пост`, categories});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getArticle(id);
  if (categories.length === 0) {
    categories = await getCategories();
  }

  if (article) {
    res.render(`new-post`, {article, DateTimeFormat, title: `Публикация`, categories});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = articlesRouter;
