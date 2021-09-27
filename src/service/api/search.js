"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  /*
  GET /api/search?query= — возвращает результаты поиска.
  Поиск публикаций выполняется по заголовку.
  Публикация соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
 */
  route.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const articles = service.findAll(query);
    const httpStatus = articles.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;
    return res.status(httpStatus)
      .json(articles);
  });
};
