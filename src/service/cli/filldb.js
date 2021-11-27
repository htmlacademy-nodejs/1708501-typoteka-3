"use strict";

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const {getLogger} = require(`../../service/lib/logger`);
const logger = getLogger({name: `filldb`});

const {getRandomInt, shuffle, readContent} = require(`../../utils`);
const {
  DEFAULT_COUNT,
  MAX_COUNT,
  MAX_COMMENTS,
  ANNOUNCE_LENGTH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
} = require(`./blogConstants`);
const {ExitCode} = require(`../constants`);
const {getRandomPicture} = require(`./helpers`);

const generateComments = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
    }));

const generateArticles = (
    count,
    titles,
    inputCategories,
    sentences,
    mockComments
) => {
  return Array(count)
    .fill({})
    .map(() => {
      const title = titles[getRandomInt(0, titles.length - 1)];
      const announce = shuffle(sentences).slice(0, ANNOUNCE_LENGTH).join(` `);
      const picture = getRandomPicture();
      const fullText = shuffle(sentences)
        .slice(0, getRandomInt(1, sentences.length - 1))
        .join(` `);
      const categories = shuffle(inputCategories).slice(
          0,
          getRandomInt(1, inputCategories.length - 1)
      );

      const comments = generateComments(
          getRandomInt(1, MAX_COMMENTS),
          mockComments
      );

      return {
        title,
        announce,
        picture,
        fullText,
        categories,
        comments,
        userId: 1,
      };
    });
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticles > MAX_COUNT) {
      logger.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.uncaughtFatalException);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const articles = generateArticles(
        countArticles,
        titles,
        categories,
        sentences,
        comments
    );

    return initDatabase(sequelize, {articles, categories});
  },
};
