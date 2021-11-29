'use strict';


const {Router} = require(`express`);
const myRouter = new Router();

const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`admin/my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`admin/comments`, {articles});
});

module.exports = myRouter;
