'use strict';

const express = require(`express`);
const path = require(`path`);
const {DateTimeFormat} = require(`intl`);

const getArticles = require(`./api/articles`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);

const app = express();
const port = 8080;
app.listen(port);

app.use(express.static(path.join(__dirname, `files`)));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.get(`/`, async (req, res) => {
  const articles = await getArticles();

  res.render(`main`, {articles, title: `Типотека`, DateTimeFormat});
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
