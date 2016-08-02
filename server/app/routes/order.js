'use strict';
var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var Order = mongoose.model('Order');
var orderHelpers = require('./order-route-helpers');
var _ = require('lodash');

router.get('/', function(req, res, next){
  fireMethods.checkAuthorisedManager(req.query['user_id'])
  .then(function(authorised){
    if(authorised){
      if(req.query.hasOwnProperty('search')){
        var query = JSON.parse(req.query.search);
        Order.find(query).exec()
        .then(function(results){
          res.status(200).json(results);
        })
      } else {
        Order.find({}).exec()
        .then(function(orders){
          res.status(200).json(orders);
        })
      }
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
    return orderHelpers.modifyProductStock(order.products)
    .then(function(modifiedProducts){
      return orderHelpers.generateOrderRef()
    })
    .then(function(refString){
      order.order_ref = refString;
      return Order.create(order)
    })
    .then(function(newOrder){
      res.status(201).json(newOrder);
    })
    .catch(function(err){
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

router.param('orderId', function(req, res, next, id){
  Order.findById(id)
  .then(function(order){
    req.order = order;
    next();
  })
})

router.get('/:orderId', function(req, res, next){
  res.status(200).json(req.order);
})

router.put('/:orderId', function(req, res, next){
  if(req.body.hasOwnProperty('orderStatus') && req.body.orderStatus === 'cancelled'){
    /* Arrays and DocumentArrays in MongoDB are not native JS arrays (which are objects) and their documents are not either, and need to be converted using #toObject() */
    orderHelpers.restockProducts(req.order.products.toObject())
    .then(function(modifiedProducts){
      return req.order;
    })
    .then(function(orderToCancel){
      _.assign(orderToCancel, req.body)
      return orderToCancel.save()
    })
    .then(function(cancelledOrder){
      res.status(200).json(cancelledOrder);
    })
  } else {
    _.assign(req.order, req.body);
    req.order.save()
    .then(function(updatedOrder){
      res.status(200).json(updatedOrder);
    });
  }
})






module.exports = router;
