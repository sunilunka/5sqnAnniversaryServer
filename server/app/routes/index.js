'use strict'

var express = require('express');

var router = express.Router();
var path = require('path');
var fireDb = require(path.join(__dirname, '../../db/fire-db'));
var env = require(path.join(__dirname, '../../env'))

router.use('/', function(req, res, next){
  res.append('Access-Control-Allow-Origin', env.ACAO);
  res.append('Access-Control-Allow-Methods', env.ACAM);
  next();
});

router.use('/products', require('./product'));
router.use('/orders', require('./order'));


module.exports = router;
