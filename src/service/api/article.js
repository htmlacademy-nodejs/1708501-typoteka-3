"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../constants`);

const articleValidator = require(`../middlewares/articleValidator`);
const articleExist = require(`../middlewares/articleExist`);
const commentValidator = require(`../middlewares/commentValidator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  // GET /api/articles - ресурс возвращает список публикаций;
  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const needComments = comments === `true`;
    const articles = await articleService.findAll(needComments);

    return res.status(HttpCode.OK).json(articles);
  });

  // GET /api/articles/:articleId — возвращает полную информацию о публикации;
  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}.`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  // POST /api/articles — создаёт новую публикацию;
  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  // PUT /api/articles/:articleId - редактирует определённую публикацию;
  route.put(
      `/:articleId`,
      articleExist(articleService),
      articleValidator,
      async (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = await articleService.update(articleId, req.body);

        return res.status(HttpCode.OK).json(updatedArticle);
      }
  );

  // DELETE /api/articles/:articleId - удаляет определённую публикацию;
  route.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  // GET /api/articles/:articleId/comments — возвращает список комментариев определённой публикации;
  route.get(
      `/:articleId/comments`,
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        if (!comments) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(`Not found comments with ${articleId}`);
        }

        return res.status(HttpCode.OK).json(comments);
      }
  );

  // POST /api/articles/:articleId/comments — создаёт новый комментарий;
  route.post(
      `/:articleId/comments`,
      articleExist(articleService),
      commentValidator,
      async (req, res) => {
        const {articleId} = req.params;
        const comment = await commentService.create(articleId, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  // DELETE /api/articles/:articleId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором;
  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(articleService),
      async (req, res) => {
        const {commentId} = req.params;
        const deleted = await commentService.drop(commentId);

        if (!deleted) {
          return res.status(HttpCode.NOT_FOUND).send(`Not found comment`);
        }

        return res.status(HttpCode.OK).json(deleted);
      }
  );
};
