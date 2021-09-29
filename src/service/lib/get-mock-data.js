'use strict';

const fs = require(`fs`).promises;

const {
  MOCK_FILE_PATH,
} = require(`../constants`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  const fileContent = await fs.readFile(MOCK_FILE_PATH);
  data = JSON.parse(fileContent);

  return data;
};

module.exports = getMockData;
