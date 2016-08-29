'use strict';

var path = require('path');
var fs = require('fs-extra');
var fireMethods = require('../../db/fire-db');
var fileGenerators = {};
var moment = require('moment');

fileGenerators.generateDtg = function(){
  return moment().format('DD HHmm') + 'H ' + moment().format('MMM').toUpperCase() + ' ' + moment().format('YYYY');
}

fileGenerators.sortByRegisteredAttendee = function(a, b){
  var userA = a.registeredAttendee;
  var userB = b.registeredAttendee;
  if(userA < userB){
    return -1;
  }
  if(userA > userB){
    return 1
  }
  return 0;
}

fileGenerators.generateEventGuestList = function(eventId){
  return fireMethods.getEventGuests(eventId);
}

fileGenerators.generateDefaultHTMLLocation = function(fileName){
  return '../../../downloads/' + fileName.trim() + '.html';
}

fileGenerators.generatePdfFileName = function(fileName){
  var spaceRegex = /\s/g;
  return fileName.trim().replace(spaceRegex, '_');
}

fileGenerators.pdfPageSettings = {
  format: 'A4',
  orientation: 'portrait',
  margin: '2.54cm'
}

module.exports = fileGenerators;
