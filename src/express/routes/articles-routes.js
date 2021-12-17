"use strict";

const {Router} = require(`express`);
const csrf = require(`csurf`);
const asyncHandler = require(`express-async-handler`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../service/constants`);

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

articlesRouter.get(
    `/category/:id`,
    asyncHandler(async (req, res) => {
      const {user} = req.session;
      const {id: categoryId} = req.params;
      let {page = 1} = req.query;
      page = +page;

      const limit = ARTICLES_PER_PAGE;
      const offset = (page - 1) * ARTICLES_PER_PAGE;

      const [{count, articles}, categories] = await Promise.all([
        api.getArticles({categoryId, limit, offset, comments: true}),
        api.getCategories(true),
      ]);
      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
      const categoryIdNumber = Number.parseInt(categoryId, 10);
      const category = categories.find((cat) => cat.id === categoryIdNumber);

      if (!category) {
        res.redirect(`/404`);
      }

      res.render(`articles-by-category`, {
        category,
        articles,
        page,
        totalPages,
        categories,
        user,
      });
    })
);

articlesRouter.get(
    `/add`,
    [auth(true), csrfProtection],
    asyncHandler(async (req, res) => {
      const {user} = req.session;

      const categories = await getAddArticleData();
      res.render(`article/new-article`, {
        categories,
        user,
        csrfToken: req.csrfToken(),
      });
    })
);

articlesRouter.post(
    `/add`,
    [auth(true), upload.single(`uploadPicture`), csrfProtection],
    asyncHandler(async (req, res) => {
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
    })
);

articlesRouter.get(
    `/edit/:id`,
    [auth(true), csrfProtection],
    asyncHandler(async (req, res) => {
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
    })
);

articlesRouter.post(
    `/edit/:id`,
    [auth(true), upload.single(`uploadPicture`), csrfProtection],
    asyncHandler(async (req, res) => {
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
    })
);

articlesRouter.get(
    `/:id`,
    csrfProtection,
    asyncHandler(async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;

      const [rawArticle, allCategories] = await Promise.all([
        api.getArticle(id),
        api.getCategories(true),
      ]);
      const {categories} = rawArticle;
      const article = {
        ...rawArticle,
        categories: categories.map(
            (cat) =>
              ({
                ...cat,
                count: allCategories.find(({id: catId}) => cat.id === catId),
              }.count)
        ),
      };
      res.render(`article/article`, {
        article,
        categories,
        user,
        csrfToken: req.csrfToken(),
      });
    })
);

articlesRouter.post(
    `/:id/comments`,
    [auth(), csrfProtection],
    asyncHandler(async (req, res) => {
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
    })
);

module.exports = articlesRouter;
