"use strict";

const {Model, DataTypes} = require(`sequelize`);

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
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`,
      }
  );

module.exports = define;
