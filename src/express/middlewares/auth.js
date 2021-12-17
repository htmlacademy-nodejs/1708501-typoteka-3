"use strict";

const {AUTHOR_USER_ID} = require(`../../service/constants`);

module.exports =
  (isCheckAuthor = false) =>
    (req, res, next) => {
      const {user} = req.session;

      if (!user) {
        return res.redirect(`/login`);
      }

      if (isCheckAuthor && user.id !== AUTHOR_USER_ID) {
        return res.redirect(`/404`);
      }

      return next();
    };
