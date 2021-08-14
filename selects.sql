SELECT
  users.name AS "Имя",
	articles.title AS "Объявление",
  articles.created_date AS "Дата"
FROM articles
INNER JOIN users
	ON articles.user_id = users.id;

SELECT
  users.name AS "Имя",
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
