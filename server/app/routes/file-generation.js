'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var fileGenMethods = require(path.join(__dirname, '../file-generation'));
var fs = require('fs-extra');

router.get('/guest-list/:eventId', function(req, res, next){
  console.log("REQ PARAMS: ", req.params);
  fileGenMethods.generateEventGuestList(req.params.eventId)
  .then(function(guestListArray){
    res.render('guestlist.njk', {
      guestlist: guestListArray
    }, function(err, html){
      var fileLocation = path.join(__dirname, '../file-generation/tmp/guestlist.html');
      console.log("FILE LOCATION: ", fileLocation);
      fs.outputFile(fileLocation, html, function(err){
        console.log("ERROR: ", err)
      })
      res.send(html);
    });
  })
})



module.exports = router;
