/* There are initial commands under postgres user*/
DROP DATABASE IF EXISTS typoteka_blog;
DROP ROLE IF EXISTS typoteka;

CREATE ROLE typoteka WITH
    LOGIN
    NOSUPERUSER
    CREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD '';

CREATE DATABASE typoteka_blog
    WITH
    OWNER = typoteka
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1;

CREATE DATABASE test_typoteka_blog
    WITH
    OWNER = typoteka
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1;

/* There are commands under typoteka user*/
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id bigserial NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(50) UNIQUE NOT NULL,
    passwordHash character varying(50) NOT NULL CHECK (char_length(passwordHash) > 6),
    avatar character varying(50),
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX email_index ON users ((lower(email)));
SET datestyle = "ISO, DMY";

CREATE TABLE articles
(
    id bigserial NOT NULL,
    title character varying(100) NOT NULL,
    announce character varying(500) NOT NULL,
    fulltext character varying(5000) NOT NULL,
    picture character varying(500),
    created_date DATE NOT NULL,
    user_id bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT articles_users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX title_index ON articles ((lower(title)));
CREATE INDEX article_created_date_index ON articles (created_date);

CREATE TABLE categories
(
    id bigserial NOT NULL,
    title character varying(50) NOT NULL,
    picture character varying(500),
    PRIMARY KEY (id)
);

CREATE TABLE comments
(
    id bigserial NOT NULL,
    text character varying(300) NOT NULL,
    created_date DATE NOT NULL,
    user_id bigint NOT NULL,
    article_id bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT comments_users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT comments_articles FOREIGN KEY (article_id)
        REFERENCES articles (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX user_id_index ON comments (user_id);
CREATE INDEX article_id_index ON comments (article_id);
CREATE INDEX comment_created_date_index ON comments (created_date);

CREATE TABLE articles_categories
(
    article_id bigint NOT NULL,
    category_id bigint NOT NULL,
    CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY(article_id) REFERENCES articles (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
