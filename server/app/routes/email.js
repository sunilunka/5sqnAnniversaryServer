'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var mailer = require(path.join(__dirname, '../email'));
var routeHelpers = require('./email-route-helpers');


router.post('/group', function(req, res, next){
  if(typeof req.body.distributionList === 'string'){
    routeHelpers.getAddresseeInformation(req.body.distributionList)
    .then(function(data){
      console.log("DATA: ", data);
    })
  }
})

router.post('/register-success', function(req, res, next){
  fireMethods.getOneAttendeeRef(req.body.userId)
  .then(function(user){
    return mailer.generateNewAttendeeEmail(user);
  })
  .then(function(status){
    if((status > 199) && (status < 300)){
      res.sendStatus(200);
    }
  })
  .catch(next);
})



module.exports = router;
