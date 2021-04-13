"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const express = require(`express`);

const {
  HttpCode,
  MOCK_FILE_PATH,
  DEFAULT_SERVER_PORT,
} = require(`../constants`);

const {Router} = express;
const offersRouter = new Router();

const app = express();
app.use(express.json());

app.use(
    `/posts`,
    offersRouter.get(`/`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(MOCK_FILE_PATH);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
    })
);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_SERVER_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`), err);
      }
      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  },
};
