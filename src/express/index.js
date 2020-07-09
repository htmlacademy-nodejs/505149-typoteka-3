'use strict';

const express = require(`express`);
const path = require(`path`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`./api/articles`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);
const {getSortedByDateComments} = require(`../lib/utils`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger();

const app = express();
const port = 8080;
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, `files`)));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.get(`/`, async (req, res) => {
  const articles = await getArticles();
  const articlesId = articles.map((it) => it.id);
  const sortedByQtyOfComments = articles.slice().sort((a, b) => b.comments.length - a.comments.length);
  const sortedByDateComments = (await getSortedByDateComments(articlesId)).slice(0, 4);

  res.render(`main`, {articles, sortedByQtyOfComments, title: `Типотека`, DateTimeFormat, sortedByDateComments});
});
app.get(`/register`, (req, res) => res.render(`login`, {isItLogin: false, title: `Регистрация`}));
app.get(`/login`, (req, res) => res.render(`login`, {isItLogin: true, title: `Войти`}));
app.get(`/search`, (req, res) => res.render(`search`, {title: `Поиск`}));

app.use((req, res) => {
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});

app.use((err, req, res, _next) => {
  res.status(err.status || 500);
  res.render(`errors/500`, {title: `Ошибка сервера`});
});

app.listen(port, (err) => {
  if (err) {
    return logger.error(`Ошибка при создании сервера: ${err}`);
  }

  return logger.info(`Ожидаю соединений на ${port} порт`);
});
