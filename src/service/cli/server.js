"use strict";

const express = require(`express`);
const http = require(`http`);

const socket = require(`../lib/socket`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const apiRoutes = require(`../api`);
const {
  HttpCode,
  DEFAULT_SERVER_PORT,
  API_PREFIX,
  ExitCode,
} = require(`../constants`);

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.uncaughtFatalException);
    }
    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;

    const app = express();
    const server = http.createServer(app);
    const io = socket(server);

    app.locals.socketio = io;

    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use(API_PREFIX, await apiRoutes());

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    try {
      server.listen(port, (err) => {
        if (err) {
          return logger.error(
              `An error occurred on server creation: ${err.message}`
          );
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.uncaughtFatalException);
    }
  },
};
