"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Category extends Model {}

// CREATE TABLE categories (
//   id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   name varchar(255) NOT NULL
// );

const define = (sequelize) =>
  Category.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: `Category`,
        tableName: `categories`,
      }
  );

module.exports = define;
