'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var Order = mongoose.model('Order');
var orderHelpers = require('./order-route-helpers');

router.get('/', function(req, res, next){
  fireMethods.checkAuthorisedManager(req.body['user_id'])
  .then(function(authorised){
    if(authorised){
      Order.find({}).exec()
      .then(function(orders){
        res.status(200).json(orders);
      })
    } else {
      res.sendStatus(401);
    }
  })
})

router.post('/new', function(req, res, next){
  req.body.products = orderHelpers.removeConflictingKeys(req.body.products);
  fireMethods.getEmailAssociatedUser(req.body.email)
  .then(function(user){
    if(!user) return req.body;
    var userName = user.firstName + " " + user.lastName;
    req.body.recipient = userName;
    req.body.user_id = user.user_id;
    return req.body;
  })
  .then(function(order){
    orderHelpers.modifyProductStock(order.products)
    .then(function(modifiedProducts){
      orderHelpers.generateOrderRef()
      .then(function(refString){
        order.order_ref = refString;
        return Order.create(order)
      })
      .then(function(newOrder){
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
})






module.exports = router;
