'use strict';

var express = require('express');
var router = express.Router();
var orderHelpers = require('./order-route-helpers');

router.post('/', function(req, res, next){
  req.body.products = orderHelpers.removeConflictingKeys(req.body.products);
  orderHelpers.modifyProductStock(req.body.products)
  .then(function(modifiedProducts){
    return orderHelpers.generateOrderRef()
    .then(function(refString){
      req.body.order_ref = refString;
      return Order.create(req.body)
    })
    .then(function(newOrder){
      res.status(201).json(newOrder);
    })
  })
  .catch(function(err){
    console.log("ERROR: ", err.errors.stock.properties);
    if(err.errors['stock']){
      res.status(200).json(req.body)
    }
  })

})






module.exports = router;
