"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
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
    const category = await categoryService.create(req.body);

    return res.status(HttpCode.CREATED).json(category);
  });

  route.put(
      `/:categoryId`,
      [routeParamsValidator, categoryExist(categoryService), categoryValidator],
      async (req, res) => {
        const {categoryId} = req.params;
        const updatedCategory = await categoryService.update(
            categoryId,
            req.body
        );

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
        const deletedCategory = await categoryService.drop(categoryId);

        if (!deletedCategory) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(`Not found with ${categoryId}`);
        }

        return res.status(HttpCode.OK).json(deletedCategory);
      }
  );
};
