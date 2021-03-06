'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var fireMethods = require(path.join(__dirname, '../../db/fire-db'));

var Order = mongoose.model('Order');

router.get('/verifyemail', function(req, res, next){
  fireMethods.getEmailAssociatedUser(req.query.email)
  .then(function(userDetails){
    if(!userDetails){
      res.sendStatus(204)
    } else {
      res.status(200).json(userDetails);
    }
  })
})

router.param('userId', function(req, res, next, id){
  fireMethods.getOneAttendeeRef(id)
  .then(function(userDetails){
    if(userDetails){
      userDetails.user_id = id;
      userDetails.uid = id;
      req.user = userDetails;
      next();
    } else {
      next(new Error('No associated user found'));
    }
  })

})

router.get('/:userId', function(req, res, next){
  res.status(200).json(req.user);
})

router.get('/:userId/orders', function(req, res, next){
  Order.find({
    user_id: req.user.user_id
  })
  .exec()
  .then(function(orders){
    res.status(200).json(orders);
  })
})

module.exports = router;
