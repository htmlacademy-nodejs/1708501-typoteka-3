DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE roles (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(8) NOT NULL
);

CREATE TABLE categories (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(255) NOT NULL
);

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    avatar varchar(50),
    role_id int NOT NULL,
    CONSTRAINT roles FOREIGN KEY (role_id)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE SET NULL
        ON DELETE SET NULL
        NOT VALID
);

CREATE TABLE articles (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(255) NOT NULL,
    announce varchar(255) NOT NULL,
    full_text text,
    picture varchar(50),
    created_date date DEFAULT CURRENT_DATE,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE comments (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id integer NOT NULL,
    user_id integer NOT NULL,
    text text NOT NULL,
    date timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE articles_categories (
    article_id integer NOT NULL,
    category_id integer NOT NULL,
    CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX ON articles(title);
