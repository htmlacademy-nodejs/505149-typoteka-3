'use strict';

const {getLogger} = require(`../../lib/logger`);

const logger = getLogger({
  name: `api-help`,
});

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Гайд:
      Команды:
      --server <port>    запускает http-сервер
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
      --fillsql <count>    формирует файл fill-db.sql
      --filldb <count>    автоматически заполняет базу данных начальными данными
    `;

    logger.info(text);
  }
};
