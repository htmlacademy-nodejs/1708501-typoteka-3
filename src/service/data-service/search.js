"use strict";

const {Op} = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
    this._sequelize = sequelize;

    this._includeUser = {
      model: this._User,
      as: Alias.USER,
      attributes: {
        exclude: [`passwordHash`],
      },
    };
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText,
        },
      },
      include: [Alias.CATEGORIES, this._includeUser],
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
