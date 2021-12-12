"use strict";

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [`id`, `name`, [Sequelize.fn(`COUNT`, `CategoryId`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._ArticleCategory,
            as: Alias.ARTICLE_CATEGORIES,
            attributes: [],
          },
        ],
      });

      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findOne(id) {
    return await this._Category.findOne({
      where: {id}
    });
  }

  async create(data) {
    return await this._Category.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await this._Category.update(data, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    return this._Category.destroy({
      where: {id}
    });
  }
}

module.exports = CategoryService;
