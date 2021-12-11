"use strict";

module.exports = (isCheckAuthor = false) => (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  if (isCheckAuthor && user.id !== 1) {
    return res.redirect(`/404`);
  }

  return next();
};
