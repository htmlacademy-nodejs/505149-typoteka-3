'use strict';

const api = require(`../express/api`).getAPI();

module.exports.getSortedByDateComments = async (articlesId) => {
  return await Promise.all(articlesId.map((id) => api.getComments(id)))
      .then((results) => results.flat().sort((a, b) => (new Date(b.date)) - (new Date(a.date))));
};

module.exports.dateToTime = (template, date) => {
  date = date.split(template[1]);
  template = template.split(template[1]);
  date = date[template.indexOf(`m`)]
      + `/` + date[template.indexOf(`d`)]
      + `/` + date[template.indexOf(`y`)];

  return (new Date(date));
};
