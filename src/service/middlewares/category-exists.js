"use strict";

const {HttpCode} = require(`../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {categoryId} = req.params;
  const category = await categoryService.findOne(categoryId);

  if (!category) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`category with ${categoryId} not found`);
  }

  res.locals.category = category;
  return next();
};
