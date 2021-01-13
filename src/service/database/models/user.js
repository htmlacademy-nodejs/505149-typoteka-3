'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createUserModel: (sequelize) => {
    class User extends Model {}

    User.init({
      firstName: {
        type: DataTypes.STRING,
        field: `first_name`,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        field: `last_name`,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Как валидировать длину пароля?
      },
      avatar: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
      timestamps: false,
      paranoid: false,
      modelName: `user`,
      tableName: `users`,
    });

    return User;
  },

  createUserLinks: (Article, User, Comment) => {
    User.hasMany(Article, {
      as: `articles`,
      foreignKey: `user_id`,
    });
    User.hasMany(Comment, {
      as: `comments`,
      foreignKey: `user_id`,
    });
  }
};
