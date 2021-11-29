"use strict";

const {DataTypes, Model} = require(`sequelize`);

// CREATE TABLE users (
//   id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   first_name varchar(255) NOT NULL,
//   last_name varchar(255) NOT NULL,
//   email varchar(255) UNIQUE NOT NULL,
//   password_hash varchar(255) NOT NULL,
//   avatar varchar(50),
//   role_id integer NOT NULL DEFAULT 0,
//   CONSTRAINT user_role FOREIGN KEY (role_id)
//       REFERENCES public.roles (id) MATCH SIMPLE
//       ON UPDATE SET DEFAULT
//       ON DELETE SET DEFAULT
//       NOT VALID
// );

class User extends Model {}

const define = (sequelize) =>
  User.init(
      {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: `User`,
        tableName: `users`
      }
  );

module.exports = define;
