"use strict";

const {Router} = require(`express`);
const csrf = require(`csurf`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const upload = require(`../../service/middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

const logger = getLogger({name: `api`});
const articlesRouter = new Router();
const csrfProtection = csrf();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories(),
  ]);
  return [article, categories];
};

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);

articlesRouter.get(`/add`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;

  const categories = await getAddArticleData();
  res.render(`article/new-article`, {
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});

articlesRouter.post(
    `/add`,
    [auth, upload.single(`uploadPicture`), csrfProtection],
    async (req, res) => {
      const {body, file, session} = req;
      const {user} = session;

      const articleData = {
        userId: user.id,
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        picture: file ? file.filename : ``,
        categories: Array.isArray(body.categories)
          ? body.categories
          : [body.categories],
      };

      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddArticleData();
        logger.error(`An error article create: ${validationMessages}`);
        res.render(`article/new-article`, {
          categories,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);

articlesRouter.get(`/edit/:id`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`article/edit-article`, {
    id,
    article,
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});

articlesRouter.post(
    `/edit/:id`,
    [auth, upload.single(`uploadPicture`), csrfProtection],
    async (req, res) => {
      const {body, file, session} = req;
      const {user} = session;
      const {id} = req.params;

      const articleData = {
        userId: user.id,
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        picture: file ? file.filename : ``,
        categories: Array.isArray(body.categories)
          ? body.categories
          : [body.categories],
      };

      try {
        await api.editArticle(id, articleData);
        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const [article, categories] = await getEditArticleData(id);
        logger.error(`An error article create: ${validationMessages}`);
        res.render(`article/edit-article`, {
          id,
          article,
          categories,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(true),
  ]);
  res.render(`article/article`, {article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body} = req;

  try {
    await api.createComment(id, {userId: user.id, text: body.comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(true),
    ]);
    res.render(`article/article`, {
      article,
      id,
      validationMessages,
      categories,
      user,
      csrfToken: req.csrfToken(),
    });
  }
});

module.exports = articlesRouter;
