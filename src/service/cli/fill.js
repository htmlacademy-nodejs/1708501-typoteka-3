"use strict";

const path = require(`path`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle, readContent} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  MAX_COUNT,
  MAX_COMMENTS,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
} = require(`./blogConstants`);
const {ExitCode} = require(`../constants`);
const {getRandomPicture} = require(`./helpers`);

const FILL_DB_FILE = path.join(__dirname, `../../../`, `fill-db.sql`);

const defaultUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar1.jpg`,
    roleId: 2,
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar2.jpg`,
    roleId: 1,
  },
];

const generateComments = (commentsCount, articleId, userCount, comments) => {
  return Array(commentsCount)
    .fill({})
    .map(() => ({
      articleId,
      userId: getRandomInt(1, userCount),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
    }));
};

const generateArticles = (
    articlesCount,
    titles,
    categoryCount,
    userCount,
    sentences,
    comments
) => {
  return Array(articlesCount)
    .fill({})
    .map((_, index) => ({
      userId: getRandomInt(1, userCount),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences)
        .slice(0, getRandomInt(1, 3))
        .join(` `)
        .substr(0, 1000),
      fullText: shuffle(sentences)
        .slice(0, getRandomInt(1, sentences.length))
        .join(` `)
        .substr(0, 1000),
      picture: getRandomPicture(),
      categories: [getRandomInt(1, categoryCount)],
      comments: generateComments(
          getRandomInt(2, MAX_COMMENTS),
          index + 1,
          userCount,
          comments
      ),
    }));
};

const runFillData = async (args) => {
  const [titles, categories, sentences, commentSentences] = await Promise.all([
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_COMMENTS_PATH),
  ]);
  const [count] = args;
  const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countArticles > MAX_COUNT) {
    console.error(chalk.red(`Не больше 1000 объявлений`));
    process.exit(ExitCode.uncaughtFatalException);
  }

  const articles = generateArticles(
      countArticles,
      titles,
      categories.length,
      defaultUsers.length,
      sentences,
      commentSentences
  );
  const comments = articles.reduce(
      (res, article) => res.concat(article.comments),
      []
  );
  const articleCategories = articles.map((article, index) => ({
    articleId: index + 1,
    categoryId: article.categories[0],
  }));

  const userValues = defaultUsers
    .map(
        ({firstName, lastName, email, passwordHash, avatar, roleId}) =>
          `('${firstName}', '${lastName}', '${email}', '${passwordHash}', '${avatar}', '${roleId}')`
    )
    .join(`,\n`);

  const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

  const articleValues = articles
    .map(
        ({title, announce, fullText, picture, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${picture}', '${userId}')`
    )
    .join(`,\n`);

  const commentValues = comments
    .map(
        ({articleId, userId, text}) => `('${articleId}', '${userId}', '${text}')`
    )
    .join(`,\n`);

  const articleCategoryValues = articleCategories
    .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
    .join(`,\n`);

  const content =
`INSERT INTO users(first_name, last_name, email, password_hash, avatar, role_id) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(article_id, user_id, text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
`;

  try {
    await fs.writeFile(FILL_DB_FILE, content);

    console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    console.error(chalk.red(`Can't write data to file...`));
  }
};

module.exports = {
  name: `--fill`,
  run(args) {
    runFillData(args);
  },
};
