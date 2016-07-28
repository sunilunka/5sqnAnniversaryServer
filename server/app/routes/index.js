'use strict';

var express = require('express');

var router = express.Router();
var path = require('path');
var fireDb = require(path.join(__dirname, '../../db/fire-db'));
var cors = require(path.join(__dirname, '../configure/cors-middleware'))

router.use('/', cors);
router.use('/products', require('./product'));
router.use('/orders', require('./order'));
router.use('/users', require('./user'));


module.exports = router;
