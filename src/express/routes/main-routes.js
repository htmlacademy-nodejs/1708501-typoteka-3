"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const upload = require(`../../service/middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const OFFERS_PER_PAGE = 8;
const MOST_COMMENTED_ARTICLES_LIMIT = 8;

const logger = getLogger({name: `api`});
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, articles}, mostCommentedArticles, categories, comments] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getArticles({limit: MOST_COMMENTED_ARTICLES_LIMIT, orderByComments: true}),
    api.getCategories(true),
    api.getLastComments(10),
  ]);
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {articles, mostCommentedArticles, comments, page, totalPages, categories, user});
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`search`, {
      results, user
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser({data: userData});
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    logger.error(`An error user registration: ${validationMessages}`);
    res.render(`sign-up`, {validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;

  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
