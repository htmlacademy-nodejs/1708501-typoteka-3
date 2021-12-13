"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const dayjs = require(`dayjs`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (inputArray) => {
  const mixedArray = [...inputArray];
  for (let i = mixedArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [mixedArray[i], mixedArray[randomPosition]] = [
      mixedArray[randomPosition],
      mixedArray[i],
    ];
  }

  return mixedArray;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).filter((str) => str.trim().length > 0);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

const formatDate = (date) => {
  return dayjs(date).format(`hh:mm DD.MM.YYYY`);
};

module.exports = {
  getRandomInt,
  shuffle,
  readContent,
  prepareErrors,
  formatDate,
};
