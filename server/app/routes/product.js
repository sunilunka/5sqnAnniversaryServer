'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var routeHelpers = require('./route-helpers');

router.get('/', function(req, res, next){
  Product.find({}).exec()
  .then(function(products){
    res.status(200).json(products);
  })
})

router.post('/new', function(req, res, next){
  var variants;
  if(req.body.hasOwnProperty('variants')){
    /* If req.body has the property variants, store in variable, then delete the property. This is because the variants are saved in the Variant collection and only their ObjectId are saved to the array. A cast error will result otherwise. Variants are populated on request for a specific product page. */
    variants = req.body.variants;
    delete req.body.variants;
  } else {
    variants = [];
  }
  Product.create(req.body)
  .then(function(product){
    if(variants.length){
      var processedVariants = routeHelpers.processVariants(product, variants);
      Variant.create(processedVariants)
      .then(function(created){
        res.status(201).json(product);
      })
    } else {
      res.status(201).json(product);
    }
  })
  .catch(next)
})

module.exports = router;
