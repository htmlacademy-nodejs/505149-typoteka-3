'use strict';

module.exports.getSortedByDateComments = (articles) => {
  const allComments = articles.reduce((acc, next) => {
    for (const comment of next.comments) {
      acc.push(comment);
    }
    return acc;
  }, []);
  return allComments.sort((a, b) => (new Date(b[`created_date`])) - (new Date(a[`created_date`])));
};

module.exports.dateToTime = (template, date) => {
  date = date.split(template[1]);
  template = template.split(template[1]);
  date = date[template.indexOf(`m`)]
      + `/` + date[template.indexOf(`d`)]
      + `/` + date[template.indexOf(`y`)];

  return (new Date(date));
};
