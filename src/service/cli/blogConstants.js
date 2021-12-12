'use strict';

const path = require(`path`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const ANNOUNCE_LENGTH = 5;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 10;

const MONTH_RESTRICT = 3;

const FILE_SENTENCES_PATH = path.join(__dirname, `../../../`, `data`, `sentences.txt`);
const FILE_TITLES_PATH = path.join(__dirname, `../../../`, `data`, `titles.txt`);
const FILE_CATEGORIES_PATH = path.join(__dirname, `../../../`, `data`, `categories.txt`);
const FILE_COMMENTS_PATH = path.join(__dirname, `../../../`, `data`, `comments.txt`);

module.exports = {
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
};
