'use strict';

const path = require(`path`);

const DEFAULT_SERVER_PORT = 3000;
const API_PREFIX = `/api`;

const MOCK_FILE_PATH = path.join(__dirname, `../../`, `mocks.json`);

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  success: 0,
  uncaughtFatalException: 1,
  invalidArgument: 9,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,

  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_SERVER_PORT,
  API_PREFIX,
  MOCK_FILE_PATH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HttpCode,
  ExitCode,
  Env
};
