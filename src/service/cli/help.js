"use strict";

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.log(
        chalk.gray(`Программа запускает http-сервер и формирует файл с данными для API.

  Гайд:
  service.js <command>

  Команды:
  --version             выводит номер версии
  --help                печатает этот текст
  --filldb <count>      заполняет DB моковыми данными
  --fill <count>        формирует файл fill-db.sql
  --server <port>       запускает http-сервер на заданном порту
`)
    );
  },
};
