"use strict";

const Alias = require(`../models/alias`);

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._Article = sequelize.models.Article;

    this._includeUser = {
      model: this._User,
      as: Alias.USER,
      attributes: {
        exclude: [`passwordHash`],
      },
    };
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
    let querySchema = {
      order: [[`createdAt`, `DESC`]],
      include: [
        this._includeUser,
        {
          model: this._Article,
          attributes: [`id`, `title`]
        },
      ],
    };

    if (limit) {
      querySchema = {
        ...querySchema,
        limit,
      };
    }

    return this._Comment.findAll(querySchema);
  }
}

module.exports = CommentsService;
