'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fulltext: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  createdAt: `created_date`,
  modelName: `article`,
  tableName: `articles`
});

module.exports = define;
