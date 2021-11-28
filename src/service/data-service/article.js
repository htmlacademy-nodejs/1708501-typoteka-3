"use strict";

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(data) {
    const article = await this._Article.create(data);
    await article.addCategories(article.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({where: {id}});
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((item) => item.get());
  }

  async findOne(id) {
    return this._Article.findByPk(id, {include: [Alias.CATEGORIES, Alias.COMMENTS]});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id},
    });
    return !!affectedRows;
  }
}

module.exports = ArticleService;
