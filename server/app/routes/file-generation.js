'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var fileGenMethods = require(path.join(__dirname, '../file-generation'));
var fs = require('fs-extra');
var phantom = require('phantom');
var moment = require('moment');

router.get('/guest-list/:eventId', function(req, res, next){
  fireMethods.getEventDetails(req.params.eventId)
  .then(function(eventDetails){
    fileGenMethods.generateEventGuestList(req.params.eventId)
    .then(function(guestListArray){
      guestListArray = guestListArray.sort(fileGenMethods.sortByRegisteredAttendee)
      res.render('guestlist.njk', {
        guestlist: guestListArray,
        evt: eventDetails,
        date: fileGenMethods.generateDtg()
      }, function(err, html){
        var fileLocation = path.join(__dirname, fileGenMethods.generateDefaultHTMLLocation('guestlist'));
        fs.outputFile(fileLocation, html, function(err){
          if(err) return next(err);
          var phInstance;
          var pageToPrint;
          phantom.create()
          .then(function(instance){
            phInstance = instance;
            return instance.createPage()
          })
          .then(function(page){
            page.property('paperSize', fileGenMethods.pdfPageSettings)
            pageToPrint = page;
            return page.open(fileLocation);
          })
          .then(function(status){
            if(status === 'success'){
              var savedDate = moment().format('YYMMDD-HHmmss');
              var fileName = savedDate + '-' + fileGenMethods.generatePdfFileName(eventDetails.name) + '-guestlist.pdf';
              var renderPath = path.join(__dirname, '../../../downloads/' + fileName);

              pageToPrint.render(renderPath);
              res.status(200).json({ assetPath: 'http://127.0.0.1:3000/downloads/' + fileName });
              return true;
            }
          })
          .then(function(created){
            if(created){
              pageToPrint.close();
              phInstance.exit();
            }
          })
          .catch(function(err){
            console.log('ERROR FOUND: ', err);
            phInstance.exit();
          })
        })
      });
    })
  })
})



module.exports = router;
