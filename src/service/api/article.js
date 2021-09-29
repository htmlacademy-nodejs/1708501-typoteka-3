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
  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    if (!articles || articles.length === 0) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found any articles.`);
    }

    return res.status(HttpCode.OK).json(articles);
  });

  // GET /api/articles/:articleId — возвращает полную информацию о публикации;
  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}.`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  // POST /api/articles — создаёт новую публикацию;
  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  // PUT /api/articles/:articleId - редактирует определённую публикацию;
  route.put(
      `/:articleId`,
      articleExist(articleService),
      articleValidator,
      (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = articleService.update(articleId, req.body);
        return res.status(HttpCode.OK).json(updatedArticle);
      }
  );

  // DELETE /api/articles/:articleId - удаляет определённую публикацию;
  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  // GET /api/articles/:articleId/comments — возвращает список комментариев определённой публикации;
  route.get(
      `/:articleId/comments`,
      articleExist(articleService),
      (req, res) => {
        const {articleId} = req.params;
        const {article} = res.locals;
        const comments = commentService.findAll(article);

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
      (req, res) => {
        const {article} = res.locals;
        const comment = commentService.create(article, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  // DELETE /api/articles/:articleId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором;
  route.delete(
      `/:articleId/comments/:commentId`,
      articleExist(articleService),
      (req, res) => {
        const {article} = res.locals;
        const {commentId} = req.params;
        const deleted = commentService.drop(article, commentId);

        if (!deleted) {
          return res.status(HttpCode.NOT_FOUND).send(`Not found comment`);
        }

        return res.status(HttpCode.OK).json(deleted);
      }
  );
};
