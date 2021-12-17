"use strict";

const {defineModels} = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({
        [next.name]: next.id,
        ...acc,
      }),
      {}
  );

  const userModels = await User.bulkCreate(users, {include: [Alias.ARTICLES, Alias.COMMENTS]});

  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const {comments: articleComments} = article;

    const comments = articleComments.map((comment) => ({
      ...comment,
      userId: userIdByEmail[comment.user],
    }));

    const enrichedArticle = {
      ...article,
      userId: userIdByEmail[article.user],
      comments
    };

    const articleModel = await Article.create(enrichedArticle, {
      include: [Alias.COMMENTS],
    });
    await articleModel.addCategories(
        enrichedArticle.categories.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
