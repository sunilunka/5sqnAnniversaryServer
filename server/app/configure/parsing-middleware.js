'use strict';

var bodyParser = require('body-parser');

/* Configure server to parse all incoming requests */
module.exports = function(app){
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
}
