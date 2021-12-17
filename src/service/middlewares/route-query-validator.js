"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);

const schema = Joi.object({
  categoryId: Joi.number().integer(),
}).unknown(true);

module.exports = (req, res, next) => {
  const {query} = req;
  const {error} = schema.validate(query);

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
