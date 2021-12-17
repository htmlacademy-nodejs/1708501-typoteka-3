"use strict";

const path = require(`path`);
const http = require(`http`);
const express = require(`express`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {getLogger} = require(`../service/lib/logger`);
const socket = require(`../service/lib/socket`);
const sequelize = require(`../service/lib/sequelize`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {
  error404Middleware,
  error500Middleware,
} = require(`./middlewares/errors`);
const {formatDate} = require(`../utils`);
const {ExitCode} = require(`../service/constants`);

const logger = getLogger({name: `api`});

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.locals.socketio = io;

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false,
    })
);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.locals.formatDate = formatDate;

app.use(error404Middleware);
app.use(error500Middleware);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

try {
  server.listen(DEFAULT_PORT, (err) => {
    if (err) {
      return logger.error(
          `An error occurred on front server creation: ${err.message}`
      );
    }

    return logger.info(`Listening to connections on ${DEFAULT_PORT}`);
  });
} catch (err) {
  logger.error(`An error occurred: ${err.message}`);
  process.exit(ExitCode.uncaughtFatalException);
}
