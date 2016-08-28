'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var fileGenMethods = require(path.join(__dirname, '../file-generation'));
var fs = require('fs-extra');
var phantom = require('phantom');

router.get('/guest-list/:eventId', function(req, res, next){
  console.log("REQ PARAMS: ", req.params);
  fileGenMethods.generateEventGuestList(req.params.eventId)
  .then(function(guestListArray){
    res.render('guestlist.njk', {
      guestlist: guestListArray
    }, function(err, html){
      var fileLocation = path.join(__dirname, '../../../downloads/guestlist.html');
      fs.outputFile(fileLocation, html, function(err){
        if(err) return next(err);
        var instance;
        var pageToPrint;
        phantom.create()
        .then(function(phInstance){
          instance = phInstance;
          return phInstance.createPage()
        })
        .then(function(page){
          page.property('paperSize', {
            format: 'A4',
            orientation: 'portrait',
            margin: '2.54cm',
          })
          pageToPrint = page;
          return page.open(fileLocation);
        })
        .then(function(status){
          console.log("STATUS: ", status)
          var savedDate = Date.now();
          var fileName = savedDate + '-guestlist.pdf'
          var renderPath = path.join(__dirname, '../../../downloads/' + savedDate + '-guestlist.pdf');

          pageToPrint.render(renderPath);
          res.status(200).json({ assetPath: 'http://127.0.0.1:3000/downloads/' + fileName });

          return renderPath;
        })
        .then(function(){

        })
        .catch(function(err){
          console.log('ERROR FOUND: ', err);
          phInstance.exit();
        })
      })
    });
  })
})



module.exports = router;
