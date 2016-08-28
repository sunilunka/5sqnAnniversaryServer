'use strict';

var path = require('path');
var nunjucks = require('nunjucks');

module.exports = function(app){
  nunjucks.configure(path.join(__dirname, '../file-generation/templates'), {
    autoescape: true,
    noCache: true,
    express: app
  })
  app.engine('njk', nunjucks.render);
  app.set('view engine', 'html');
}
