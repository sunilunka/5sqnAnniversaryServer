'use strict';

var path = require('path');
var fireMethods = require('../../db/fire-db');

var fileGenerators = {};

var generateGuestListHTML = function(array){
  
}

fileGenerators.generateEventGuestList = function(eventId){
  return fireMethods.getEventGuests(eventId)
  .then(function(guestListArray){
    console.log("GUEST LIST OBJ: ", guestListArray);
    return guestListArray;
  })
}

module.exports = fileGenerators;
