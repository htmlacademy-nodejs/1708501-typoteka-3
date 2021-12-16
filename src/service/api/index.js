"use strict";

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const {defineModels} = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService
} = require(`../data-service`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`../api/user`);

module.exports = async () => {
  defineModels(sequelize);
  const app = new Router();

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));

  return app;
};

