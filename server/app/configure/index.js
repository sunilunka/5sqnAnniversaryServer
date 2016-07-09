'use strict';

var middleware = require('./middleware');

module.exports = function(app){
  middleware(app)
}
