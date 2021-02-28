'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  readContent,
} = require(`../../utils`);
const {
  DEFAULT_COUNT,
  MAX_COUNT,
  ANNOUNCE_LENGTH,
  MONTH_RESTRICT,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH
} = require(`./blogConstants`);
const {ExitCode} = require(`../constants`);

const FILE_NAME = path.join(__dirname, `../../../`, `mocks.json`);

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateOffers = (count, titles, categories, sentences) => {
  return Array(count).fill({}).map(() => {
    const title = titles[getRandomInt(0, titles.length - 1)];
    const announce = shuffle(sentences).slice(0, ANNOUNCE_LENGTH).join(` `);
    const fullText = shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `);
    const category = shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));

    const today = new Date();
    const minDate = new Date(new Date().setMonth(today.getMonth() - MONTH_RESTRICT));
    const createdDate = getRandomDate(minDate, today);

    return ({title, createdDate, announce, fullText, category});
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

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
