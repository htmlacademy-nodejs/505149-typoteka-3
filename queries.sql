-- Cписок всех категорий
SELECT
  id AS "ID",
  title AS "Категория"
FROM categories;

-- Список категорий для которых создана минимум одна публикация
SELECT
  id AS "ID",
  title AS "Категория"
FROM categories
RIGHT JOIN articles_categories
  ON categories.id = articles_categories.category_id
GROUP BY id
ORDER BY id;

-- Список категорий с количеством публикаций
SELECT
  id AS "ID",
  title AS "Категория",
  count(id) AS "Количество объявлений"
FROM categories
RIGHT JOIN articles_categories
  ON categories.id = articles_categories.category_id
GROUP BY id
ORDER BY count(id) DESC;

-- Список публикаций (идентификатор публикации, заголовок публикации, анонс, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации
SELECT
  articles.id AS "ID",
  articles.title AS "Заголовок",
  articles.announce AS "Анонс",
  articles.created_date AS "Дата создания",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия",
  users.email AS "Email",
  count(comments) AS "Количество комментариев",
  aggr_categories.str_categories as "Жанры"
FROM articles
LEFT JOIN users
  ON articles.user_id = users.id
LEFT JOIN "comments"
  ON comments.article_id = articles.id
LEFT JOIN
(
  SELECT
    articles.id AS article_id,
    string_agg(categories.title, ', ') AS str_categories
  FROM articles_categories
  LEFT JOIN articles
    ON articles_categories.article_id = articles.id
  LEFT JOIN categories
    ON articles_categories.category_id = categories.id
  GROUP BY articles.id
  ORDER BY articles.id
) aggr_categories
  ON articles.id = aggr_categories.article_id
GROUP BY articles.id, users.first_name, users.last_name, users.email, aggr_categories.str_categories
ORDER BY articles.id;

-- Полная информация определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий)
SELECT
  articles.id AS "ID",
  articles.title AS "Заголовок",
  articles.announce AS "Анонс",
  articles.fulltext AS "Текст",
  articles.created_date AS "Дата создания",
  articles.picture AS "Путь к изображению",
  concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия",
  users.email AS "Email",
  count(comments) AS "Количество комментариев",
  aggr_categories.str_categories as "Жанры"
FROM articles
LEFT JOIN users
  ON articles.user_id = users.id
LEFT JOIN "comments"
  ON comments.article_id = articles.id
LEFT JOIN
(
  SELECT
    articles.id AS article_id,
    string_agg(categories.title, ', ') AS str_categories
  FROM articles_categories
  LEFT JOIN articles
    ON articles_categories.article_id = articles.id
  LEFT JOIN categories
    ON articles_categories.category_id = categories.id
  WHERE articles.id = 4
  GROUP BY articles.id
) aggr_categories
  ON articles.id = aggr_categories.article_id
WHERE articles.id = 4
GROUP BY articles.id, users.first_name, users.last_name, users.email, aggr_categories.str_categories;

-- Список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария)
SELECT
	comments.id as "ID Комментария",
	articles.id AS "ID Публикации",
	concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия",
	comments."text" AS "Текст комментария"
FROM "comments"
LEFT JOIN articles
  ON comments.article_id = articles.id
LEFT JOIN users
  ON comments.user_id = users.id
GROUP BY comments.id, articles.id, users.first_name, users.last_name
ORDER BY comments.created_date DESC
LIMIT 5;

-- Список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии
SELECT
	comments.id as "ID Комментария",
	articles.id AS "ID Объявления",
	concat(users.first_name, ' ', users.last_name) AS "Имя и фамилия",
	comments."text" as "Текст комментария"
FROM articles
LEFT JOIN "comments"
  ON articles.id = comments.article_id
LEFT JOIN users
  ON articles.user_id = users.id
WHERE articles.id = 2
GROUP BY articles.id, comments.id, users.first_name, users.last_name
ORDER BY comments.created_date DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 2;
