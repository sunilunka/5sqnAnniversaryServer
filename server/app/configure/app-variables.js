'use strict';
var path = require('path');
var env = require(path.join(__dirname, '../../env'));

module.exports = function(app){

  app.setValue('env', env);

}
