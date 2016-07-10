'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');

router.get("/", function(req, res, next){
  Product.find({})
  .then(function(products){
    console.log("PRODUCTS: ", products);
    res.status(200).json(products);
  })
})

router.post("/new", function(req, res, next){
  console.log("REQUEST BODY: ", req.body);
  // Product.create(req.body)
})

module.exports = router;
