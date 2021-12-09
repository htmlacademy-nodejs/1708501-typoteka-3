"use strict";

const Alias = require(`../models/alias`);
const {DEFAULT_COMMENTS_LIMIT} = require(`../constants`);

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }

  async getLastComments(limit) {
    return this._Comment.findAll({
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        {
          model: this._User,
          as: Alias.USER,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      limit: limit || DEFAULT_COMMENTS_LIMIT
    });
  }
}

module.exports = CommentsService;
