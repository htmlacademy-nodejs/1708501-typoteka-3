"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const CategoryService = require(`../data-service/category`);
const categoryExist = require(`../middlewares/category-exists`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/categories`, route);

  // GET /api/categories — возвращает список категорий;
  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);

    return res.status(HttpCode.OK).json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const {name} = req.body;
    const category = await categoryService.create({name});

    return res.status(HttpCode.CREATED).json(category);
  });

  route.put(
      `/:categoryId`,
      [routeParamsValidator, categoryExist(categoryService), categoryValidator],
      async (req, res) => {
        const {name} = req.body;
        const {categoryId} = req.params;
        const updatedCategory = await categoryService.update(categoryId, {
          name,
        });

        if (!updatedCategory) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(`Not found with ${categoryId}`);
        }

        return res.status(HttpCode.OK).json(updatedCategory);
      }
  );

  route.delete(
      `/:categoryId`,
      [routeParamsValidator, categoryExist(categoryService)],
      async (req, res) => {
        const {categoryId} = req.params;
        const categoryHasArticles =
        !!(await categoryService.getArticlesInCategoryCount(categoryId));

        if (categoryHasArticles) {
          return res.status(HttpCode.BAD_REQUEST).json(!categoryHasArticles);
        }

        const deletedCategory = await categoryService.drop(categoryId);
        return res.status(HttpCode.OK).json(deletedCategory);
      }
  );
};
