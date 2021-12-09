"use strict";

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;

    this._includeUser = {
      model: this._User,
      as: Alias.USER,
      attributes: {
        exclude: [`passwordHash`],
      },
    };
  }

  async create(data) {
    const article = await this._Article.create(data);
    await article.addCategories(data.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({where: {id}});
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [Alias.USER],
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((item) => item.get());
  }

  async findOne(id) {
    return this._Article.findByPk(id, {
      include: [Alias.CATEGORIES, Alias.COMMENTS, this._includeUser],
    });
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id},
    });
    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS, this._includeUser],
      order: [[`createdAt`, `DESC`]],
      distinct: true,
    });
    return {count, articles: rows};
  }

  async getMostCommentedArticles({limit}) {
    const result = await this._Article.findAll({
      limit,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [{
        model: this._Comment,
        as: Alias.COMMENTS,
        attributes: []
      }],
      group: [`Article.id`],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ],
      subQuery: false
    });

    return result.map((it) => it.get());
  }
}

module.exports = ArticleService;
