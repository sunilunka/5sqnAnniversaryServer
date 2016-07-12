'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var routeHelpers = require('./route-helpers');
var _ = require('lodash');

router.get('/', function(req, res, next){

})

router.post('/', function(req, res, next){
  var savedVariant;
  Variant.create(req.body)
  .then(function(variant){
    savedVariant = variant;
    return Product.findById(variant.product_id)
    .then(function(product){
      product.variants.addToSet(variant._id);
      return product.save();
    })
  })
  .then(function(product){
    res.status(201).json(savedVariant);
  })
})

module.exports = router;
