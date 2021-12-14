"use strict";

const {HttpCode} = require(`../../service/constants`);

const error404Middleware = (req, res) => {
  const {user} = req.session;
  return res.status(HttpCode.NOT_FOUND).render(`errors/404`, {user});
};

const error400Middleware = (req, res) => {
  const {user} = req.session;
  return res.status(HttpCode.BAD_REQUEST).render(`errors/404`, {user});
};

const error500Middleware = (error, req, res) => {
  const {user} = req.session;
  return res
    .status(error.status || HttpCode.INTERNAL_SERVER_ERROR)
    .render(`errors/500`, {user});
};

module.exports = {error500Middleware, error404Middleware, error400Middleware};
