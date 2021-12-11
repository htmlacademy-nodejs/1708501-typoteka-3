'use strict';


const {Router} = require(`express`);

const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, auth(true), async (req, res) => {
  const {user} = req.session;
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`admin/my`, {articles, categories, user});
});

myRouter.get(`/comments`, auth(true), async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`admin/comments`, {articles, user});
});

module.exports = myRouter;
