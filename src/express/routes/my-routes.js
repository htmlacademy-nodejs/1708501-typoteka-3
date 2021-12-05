'use strict';


const {Router} = require(`express`);
const myRouter = new Router();

const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`admin/my`, {articles, categories});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`admin/comments`, {articles});
});

module.exports = myRouter;
