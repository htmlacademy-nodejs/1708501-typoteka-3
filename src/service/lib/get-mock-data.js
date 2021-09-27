'use strict';

const fs = require(`fs`).promises;

const {
  MOCK_FILE_PATH,
} = require(`../constants`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(MOCK_FILE_PATH);
    data = JSON.parse(fileContent);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
