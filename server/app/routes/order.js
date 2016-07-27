'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var orderHelpers = require('./order-route-helpers');

router.post('/new', function(req, res, next){
  req.body.products = orderHelpers.removeConflictingKeys(req.body.products);
  orderHelpers.modifyProductStock(req.body.products)
  .then(function(modifiedProducts){
    return orderHelpers.generateOrderRef()
    .then(function(refString){
      req.body.order_ref = refString;
      return Order.create(req.body)
    })
    .then(function(newOrder){
      console.log("NEW ORDER: ", newOrder);
      res.status(201).json(newOrder);
    })
  })
  .catch(function(err){
    // console.log("ERROR: ", err);
    if(err.errors['stock']){
      orderHelpers.amendOrderQuantities(req.body.products)
      .then(function(amendedOrderItems){
        req.body.products = amendedOrderItems;
        res.status(200).json(req.body)
      })
    } else {
      next(err);
    }
  })

})






module.exports = router;
