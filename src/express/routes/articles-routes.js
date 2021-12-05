'use strict';


const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const {prepareErrors} = require(`../../utils`);

const logger = getLogger({name: `api`});
const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`article/new-article`, {categories});
});

articlesRouter.post(`/add`,
    upload.single(`uploadPicture`),
    async ({body, file}, res) => {
      const articleData = {
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        picture: file ? file.filename : ``,
        categories: Array.isArray(body.categories) ? body.categories : [body.categories],
      };

      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddArticleData();
        logger.error(`An error article create: ${validationMessages}`);
        res.render(`article/new-article`, {categories, validationMessages});
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`article/edit-article`, {id, article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`uploadPicture`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    picture: file ? file.filename : ``,
    categories: Array.isArray(body.categories) ? body.categories : [body.categories],
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    logger.error(`An error article create: ${validationMessages}`);
    res.render(`article/edit-article`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(true)
  ]);
  res.render(`article/article`, {article, categories});
});


articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(true)
    ]);
    res.render(`offers/ticket`, {article, id, validationMessages, categories});
  }
});

module.exports = articlesRouter;
