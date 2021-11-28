"use strict";

const {Model, DataTypes} = require(`sequelize`);

// CREATE TABLE articles (
//   id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   title varchar(255) NOT NULL,
//   announce varchar(1000) NOT NULL,
//   full_text text,
//   picture varchar(50),
//   user_id integer NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES users (id)
//       ON DELETE CASCADE
//       ON UPDATE CASCADE
// );

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        announce: {
          type: DataTypes.STRING(1000),
          allowNull: false,
        },
        fullText: {
          type: DataTypes.TEXT(`long`),
          allowNull: false,
        },
        picture: DataTypes.STRING,
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`,
      }
  );

module.exports = define;
