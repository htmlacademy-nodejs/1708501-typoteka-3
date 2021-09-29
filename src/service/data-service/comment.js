'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../cli/blogConstants`);

class CommentsService {
  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    article.comments.push(newComment);
    return newComment;
  }

  drop(article, commentId) {
    if (!article) {
      return null;
    }
    const comment = article.comments.find((item) => item.id === commentId);
    article.comments = article.comments.filter((item) => item.id !== commentId);
    return comment;
  }

  findAll(article) {
    return article.comments || [];
  }
}

module.exports = CommentsService;
