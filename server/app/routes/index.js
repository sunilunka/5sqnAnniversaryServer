'use strict'

var express = require('express');

var router = express.Router();

var firebase = require('firebase');


router.get('/', function(req, res, next){
  console.log("REQUEST: ", req.headers);
  var db = firebase.database();
  var attendeesRef = db.ref('/attendees');
  var attendees = "";
  attendeesRef.on("value", function(snapshot){
    attendees = snapshot.val();
    attendees = JSON.stringify(attendees)
    res.set({
      'Access-Control-Allow-Origin': '*'
    })
    res.status(200).json(attendees);
  })
})



module.exports = router;
