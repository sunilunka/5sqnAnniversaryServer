'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var mailer = require(path.join(__dirname, '../email'));
var routeHelpers = require('./email-route-helpers');


router.post('/group', function(req, res, next){
  console.log("TYPE OF REQ DIST LIST: ", typeof req.body.distributionList);
  if(typeof req.body.distributionList === 'string'){
    routeHelpers.getAddresseeInformation(req.body.distributionList, next)
    .then(function(data){
      var dispatchArray = routeHelpers.compileGroupUsers(data);
      return mailer.generateGroupEmail(dispatchArray, req.body);
    })
    .then(function(data){
      console.log("RESOLVED DATA: ", data);
      res.sendStatus(200);
    })
    .catch(function(err){
      console.log("ERROR: ", err);
      res.sendStatus(500);
    })
  } else if(Array.isArray(req.body.distributionList)){
    /* Array should hold all relevant user details so no call to firebase is necessary */
    console.log("DIST LIST IS ARRAY: ", req.body.distributionList);
    return mailer.generateGroupEmail(req.body.distributionList, req.body)
    .then(function(data){
      res.sendStatus(200);
    })
    .catch(function(err){
      console.log("ERROR: ", err);
      res.sendStatus(500);
    })
  }
})

router.post('/event-payment-success', function(req, res, next){

})

router.post('/selected-users', function(req, res, next){
  fireMethods.getOneAttendeeRef(req.body.userId)
  .then(function(user){

  })
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
