'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var _ = require('lodash');

router.put('/:variantId/stock', function(req, res, next){

})

module.exports = router;
