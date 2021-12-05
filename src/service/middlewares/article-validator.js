"use strict";


const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);


const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  ANNOUNCE_MIN: `Описание содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Описание содержит более 250 символов`,
  FULL_TEXT_MAX: `Заголовок не может содержать более 1000 символов`,
};

const schema = Joi.object({
  // Заголовок. Обязательное поле. Минимум 30 символов. Максимум 250;
  title: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.TITLE_MIN,
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  // Фотография. Необязательное поле. Позволяет загружать изображения в формате jpg и png;
  picture: Joi.string().allow(null, ``).pattern(/\.(jpe?g|png)$/i).messages({
    'string.pattern.base': ErrorArticleMessage.PICTURE
  }),
  // Категории. Обязательно для выбора одна категория;
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  // Анонс публикации. Обязательное поле. Минимум 30 символов. Максимум 250;
  announce: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  // Полный текст публикации. Необязательное поле. Максимум 1000 символов.
  fullText: Joi.string().allow(null, ``).max(1000).messages({
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX
  })
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
