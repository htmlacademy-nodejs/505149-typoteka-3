'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  fulltext: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(5000),
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
