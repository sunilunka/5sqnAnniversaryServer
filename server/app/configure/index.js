'use strict';

var parsingMiddleware = require('./parsing-middleware');

module.exports = function(app){
  parsingMiddleware(app)
}
