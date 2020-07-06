'use strict';

const getComments = require(`../express/api/comments`);

module.exports.getSortedByDateComments = async (articlesId) => {
  return await Promise.all(articlesId.map((id) => getComments(id)))
      .then((results) => results.flat().sort((a, b) => (new Date(b.date)) - (new Date(a.date))));
};
