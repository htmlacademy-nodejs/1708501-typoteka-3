'use strict';

const fs = require(`fs`);
const path = require(`path`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const {
  DEFAULT_COUNT,
  MAX_COUNT,
  TITLES,
  SENTENCES,
  ANNOUNCE_LENGTH,
  CATEGORIES,
  MONTH_RESTRICT,
} = require(`./blogConstants`);
const {ExitCode} = require(`../constants`);

const FILE_NAME = path.join(__dirname, `../../../`, `mocks.json`);

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateOffers = (count) => {
  return Array(count).fill({}).map(() => {
    const title = TITLES[getRandomInt(0, TITLES.length - 1)];
    const announce = shuffle(SENTENCES).slice(1, ANNOUNCE_LENGTH).join(` `);
    const fullText = shuffle(SENTENCES).slice(1, getRandomInt(1, SENTENCES.length - 1)).join(` `);
    const category = shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length - 1));

    const today = new Date();
    const minDate = new Date(new Date().setMonth(today.getMonth() - MONTH_RESTRICT));
    const createdDate = getRandomDate(minDate, today);

    return ({title, createdDate, announce, fullText, category});
  });
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > MAX_COUNT) {
      console.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.uncaughtFatalException);
    }

    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
