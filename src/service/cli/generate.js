"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {getRandomInt, shuffle, readContent} = require(`../../utils`);
const {
  DEFAULT_COUNT,
  MAX_COUNT,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  ANNOUNCE_LENGTH,
  MONTH_RESTRICT,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
} = require(`./blogConstants`);
const {ExitCode, MOCK_FILE_PATH} = require(`../constants`);
const {getRandomPicture, getRandomDate} = require(`./helpers`);

const generateComments = (count, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
    }));

const generateOffers = (count, titles, categories, sentences, mockComments) => {
  return Array(count)
    .fill({})
    .map(() => {
      const id = nanoid(MAX_ID_LENGTH);
      const title = titles[getRandomInt(0, titles.length - 1)];
      const announce = shuffle(sentences).slice(0, ANNOUNCE_LENGTH).join(` `);
      const picture = getRandomPicture();
      const fullText = shuffle(sentences)
        .slice(0, getRandomInt(1, sentences.length - 1))
        .join(` `);
      const category = shuffle(categories).slice(
          0,
          getRandomInt(1, categories.length - 1)
      );

      const today = new Date();
      const minDate = new Date(
          new Date().setMonth(today.getMonth() - MONTH_RESTRICT)
      );
      const createdDate = getRandomDate(minDate, today);

      const comments = generateComments(
          getRandomInt(1, MAX_COMMENTS),
          mockComments
      );

      return {
        id,
        title,
        createdDate,
        announce,
        picture,
        fullText,
        category,
        comments,
      };
    });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.uncaughtFatalException);
    }

    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const content = JSON.stringify(
        generateOffers(countOffer, titles, categories, sentences, comments)
    );

    try {
      await fs.writeFile(MOCK_FILE_PATH, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
