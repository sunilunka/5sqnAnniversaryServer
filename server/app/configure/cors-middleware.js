'use strict';
var path = require('path');
var env = require(path.join(__dirname, '../../env'));

module.exports = function(req, res, next){
  res.append('Access-Control-Allow-Origin', env.ACAO);
  res.append('Access-Control-Allow-Methods', env.ACAM);
  res.append('Access-Control-Allow-Headers', env.ACAH);
  res.append('Access-Control-Max-Age', env.ACMA);

  if(req.method === 'OPTIONS'){
    res.sendStatus(200);
  } else {
    next();
  }
}
