'use strict';

var bodyParser = require('body-parser');
var firebaseInit = require('./authentication/firebase_config');

module.exports = function(app){
  firebaseInit();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
}
