'use strict';

const express = require(`express`);
const path = require(`path`);

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

app.get(`/`, (req, res) => res.render(`main`, {title: `Типотека`}));
app.get(`/register`, (req, res) => res.render(`login`, {isItLogin: false, title: `Регистрация`}));
app.get(`/login`, (req, res) => res.render(`login`, {isItLogin: true, title: `Войти`}));
app.get(`/search`, (req, res) => res.render(`search`, {title: `Поиск`}));
app.get(`/500`, (req, res) => res.render(`errors/500`, {title: `Ошибка сервера`}));

app.use((req, res) => {
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});
