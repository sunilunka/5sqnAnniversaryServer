'use strict';
var path = require('path');
var env = require(path.join(__dirname, '../../env'))

module.exports = function(req, res, next){
  res.set({
    'Access-Control-Allow-Origin': env.ACAO
  })
}
