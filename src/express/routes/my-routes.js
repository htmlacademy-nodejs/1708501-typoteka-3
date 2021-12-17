"use strict";

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const {MOST_COMMENTED_ARTICLES_LIMIT, LAST_COMMENTS_LIMIT} = require(`../../service/constants`);

const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(
    `/`,
    auth(true),
    asyncHandler(async (req, res) => {
      const {user} = req.session;
      const [articles, categories] = await Promise.all([
        api.getArticles({comments: true}),
        api.getCategories(true),
      ]);

      res.render(`admin/my`, {articles, categories, user});
    })
);

myRouter.get(
    `/comments`,
    auth(true),
    asyncHandler(async (req, res) => {
      const {user} = req.session;
      const comments = await api.getLastComments();

      res.render(`admin/comments`, {comments, user});
    })
);

myRouter.get(
    `/delete/article/:id`,
    auth(true),
    asyncHandler(async (req, res) => {
      const {id} = req.params;

      await api.deleteArticle(id);

      const io = req.app.locals.socketio;
      if (io) {
        const [mostCommentedArticles, lastComments] = await Promise.all([
          api.getArticles({
            limit: MOST_COMMENTED_ARTICLES_LIMIT,
            orderByComments: true,
          }),
          api.getLastComments(LAST_COMMENTS_LIMIT),
        ]);

        io.emit(`comment:create`, mostCommentedArticles, lastComments);
      }

      res.redirect(`/my`);
    })
);

myRouter.get(
    `/comments/delete/:articleId/:commentId`,
    auth(true),
    asyncHandler(async (req, res) => {
      const {articleId, commentId} = req.params;

      await api.deleteComment(articleId, commentId);

      const io = req.app.locals.socketio;
      if (io) {
        const [mostCommentedArticles, lastComments] = await Promise.all([
          api.getArticles({
            limit: MOST_COMMENTED_ARTICLES_LIMIT,
            orderByComments: true,
          }),
          api.getLastComments(LAST_COMMENTS_LIMIT),
        ]);

        io.emit(`comment:create`, mostCommentedArticles, lastComments);
      }

      res.redirect(`/my/comments`);
    })
);

module.exports = myRouter;
