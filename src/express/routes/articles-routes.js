'use strict';


const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger({name: `api`});
const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

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
  const categories = await api.getCategories();
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
      } catch (error) {
        logger.error(`An error article create: ${error.message}`);
        res.redirect(`back`);
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`article/edit-article`, {article, categories});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
