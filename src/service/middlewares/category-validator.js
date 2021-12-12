"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);

const ErrorCategoryMessage = {
  TEXT: `Длина категории должна быть от 5 до 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    "string.base": ErrorCategoryMessage.TEXT,
  }),
});

module.exports = (req, res, next) => {
  const category = req.body;
  const {error} = schema.validate(category, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
