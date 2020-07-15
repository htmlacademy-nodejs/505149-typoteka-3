/* There are INSERTs*/
INSERT INTO users VALUES
(1, 'Стивен', 'Кинг', 'a@gmail.com', 'qwertyasd', 'image.jpg'),
(2, 'Сергей', 'Лукьяненко', 'b@gmail.com', 'qwertyasd', 'image.jpg'),
(3, 'Джон', 'Резиг', 'c@gmail.com', 'qwertyasd', 'image.jpg'),
(4, 'Артур Конан', 'Дойл', 'd@gmail.com', 'qwertyasd', 'image.jpg'),
(5, 'Говард Филлипс', 'Лавкрафт', 'e@gmail.com', 'qwertyasd', 'image.jpg'),
(6, 'Антон', 'Чехов', 'f@gmail.com', 'qwertyasd', 'image.jpg'),
(7, 'Джанет', 'Азимов', 'g@gmail.com', 'qwertyasd', 'image.jpg'),
(8, 'Айзек', 'Азимов', 'h@gmail.com', 'qwertyasd', 'image.jpg'),
(9, 'Курт', 'Занднер', 'i@gmail.com', 'qwertyasd', 'image.jpg'),
(10, 'Питер', 'Уоттс', 'j@gmail.com', 'qwertyasd', 'image.jpg'),
(11, 'Роберт', 'Сойер', 'k@gmail.com', 'qwertyasd', 'image.jpg'),
(12, 'Мишель', 'Верн', 'l@gmail.com', 'qwertyasd', 'image.jpg');

INSERT INTO articles VALUES
(1, 'Оно', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '1986-01-01', 1),
(2, 'Кладбище домашних животных', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '1983-11-13', 3),
(3, 'Под куполом', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2009-01-01', 5),
(4, '11/22/63', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2011-11-08', 7),
(5, 'Зелёная миля', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '1996-01-01', 2),
(6, 'Доктор сон', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2013-01-01', 8),
(7, 'Чужак', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2018-01-01', 9),
(8, 'Институт', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2019-09-01', 11),
(9, 'Ночной дозор', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '1998-01-01', 12),
(10, 'Дневной дозор', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2000-01-01', 3),
(11, 'Сумеречный дозор', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2003-01-01', 6),
(12, 'Последний дозор', 'Не знаю что сказать', 'Даже не знаю что сказать', 'picture.png', '2005-01-01', 2);

INSERT INTO categories VALUES
(1, 'Фантастика', 'picture.png'),
(2, 'Ужасы', 'picture.png'),
(3, 'Драма', 'picture.png'),
(4, 'Трагедия', 'picture.png'),
(5, 'Комедия', 'picture.png'),
(6, 'Роман', 'picture.png'),
(7, 'IT', 'picture.png');

INSERT INTO comments VALUES
(1, 'Даже не знаю что сказать', '1986-01-01', 1, 12),
(2, 'Даже не знаю что сказать', '1987-01-01', 3, 1),
(3, 'Даже не знаю что сказать', '1988-01-01', 7, 3),
(4, 'Даже не знаю что сказать', '1983-01-01', 12, 6),
(5, 'Даже не знаю что сказать', '1981-01-01', 2, 10),
(6, 'Даже не знаю что сказать', '1984-01-01', 4, 11),
(7, 'Даже не знаю что сказать', '1980-01-01', 1, 2),
(8, 'Даже не знаю что сказать', '1985-01-01', 2, 8),
(9, 'Даже не знаю что сказать', '1982-01-01', 9, 1),
(10, 'Даже не знаю что сказать', '1989-01-01', 10, 7);

INSERT INTO articles_categories VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(12, 2),
(1, 3),
(11, 1),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
(8, 3),
(7, 4),
(2, 5),
(4, 5),
(9, 6),
(3, 7),
(8, 7),
(12, 7);

/* There are SELECTs for checking*/
SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	articles.title AS "Объявление",
  articles.created_date AS "Дата"
FROM articles
INNER JOIN users
	ON articles.user_id = users.id;

SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	articles.title AS "Объявление",
  comments.text AS "Комментарий"
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
INNER JOIN articles
	ON comments.article_id = articles.id;

SELECT
	articles.title AS "Объявление",
	string_agg(categories.title, ', ') AS "Жанры"
FROM articles_categories
LEFT JOIN articles
	ON articles_categories.article_id = articles.id
LEFT JOIN categories
	ON articles_categories.category_id = categories.id
GROUP BY articles.title;
