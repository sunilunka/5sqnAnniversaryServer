'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var fileGenMethods = require(path.join(__dirname, '../file-generation'));
var fs = require('fs-extra');
var pdfGen = require('html-pdf');
var phantom = require('phantom');

router.get('/guest-list/:eventId', function(req, res, next){
  console.log("REQ PARAMS: ", req.params);
  fileGenMethods.generateEventGuestList(req.params.eventId)
  .then(function(guestListArray){
    res.render('guestlist.njk', {
      guestlist: guestListArray
    }, function(err, html){
      var fileLocation = path.join(__dirname, '../../downloads/guestlist.html');
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
          pageToPrint = page;
          return page.open(fileLocation);
        })
        .then(function(status){
          console.log("STATUS: ", status)
          var savedDate = Date.now();
          var fileName = savedDate + '-guestlist.pdf'
          var renderPath = path.join(__dirname, '../../../downloads/' + );
          pageToPrint.render(renderPath);
          res.status(200).json({ assetPath: '/downloads/' });
          return renderPath;
        })
        .then(function(){

        })
        .catch(function(err){
          phInstance.exit();
        })
      })
    });
  })
})



module.exports = router;
