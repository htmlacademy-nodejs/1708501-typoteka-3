"use strict";

const express = require(`express`);

const {getLogger} = require(`../lib/logger`);
const apiRoutes = require(`../api`);

const {HttpCode, DEFAULT_SERVER_PORT, API_PREFIX} = require(`../constants`);

const logger = getLogger({name: `api`});

const app = express();
app.use(express.json());

app.use(API_PREFIX, apiRoutes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;
    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(
              `An error occurred on server creation: ${err.message}`
          );
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
