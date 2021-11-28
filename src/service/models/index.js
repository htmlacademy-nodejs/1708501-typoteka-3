"use strict";

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Alias = require(`./alias`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`,
  });
  // Article.belongsTo(User, {foreignKey: `userId`});

  Comment.belongsTo(Article, {foreignKey: `articleId`});
  // Comment.belongsTo(User, {foreignKey: `userId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES,
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES,
  });
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  // User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  // User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
