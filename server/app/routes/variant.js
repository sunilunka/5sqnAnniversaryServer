'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var routeHelpers = require('./product-route-helpers.js');
var _ = require('lodash');

router.param('variantId', function(req, res, next, id){
  Variant.findById(id)
  .then(function(variant){
    req.variant = variant;
    next();
  })
})

router.put('/:variantId/stock', routeHelpers.processAdminStockUpdate)

module.exports = router;
