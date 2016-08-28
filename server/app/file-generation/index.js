'use strict';

var path = require('path');
var fireMethods = require('../../db/fire-db');
var nunjucks  = require('nunjucks');
var fileGenerators = {};

var generateGuestListHTML = function(array){

}

fileGenerators.generateEventGuestList = function(eventId){
  return fireMethods.getEventGuests(eventId);
}

module.exports = fileGenerators;
