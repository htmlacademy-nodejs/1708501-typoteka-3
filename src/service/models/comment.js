"use strict";

const {DataTypes, Model} = require(`sequelize`);

//  CREATE TABLE comments (
//   id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   article_id integer NOT NULL,
//   user_id integer NOT NULL,
//   text text NOT NULL,
//   date timestamp DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES users (id)
//       ON DELETE CASCADE
//       ON UPDATE CASCADE,
//   FOREIGN KEY (article_id) REFERENCES articles (id)
//       ON DELETE CASCADE
//       ON UPDATE CASCADE
// );

class Comment extends Model {}

const define = (sequelize) =>
  Comment.init(
      {
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: `Comment`,
        tableName: `comments`,
      }
  );

module.exports = define;
