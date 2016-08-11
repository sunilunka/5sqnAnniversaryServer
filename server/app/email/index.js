'use strict';
var path = require('path');
var apiKey = require(path.join(__dirname, '../configure/authentication/sendgrid.json')).SEND_GRID_AUTH;
var sg = require('sendgrid')(apiKey);


var mailHelper = require('sendgrid').mail;


var mailer = {};

mailer.generateOrderSuccessEmail = function(order){
  return require('./orderEmailGenerator')(sg, order);
}

mailer.generateNewAttendeeEmail = function(userData){
  return require('./newAttendeeEmailGenerator')(sg, userData);
}

mailer.generateOrderDispatchEmail = function(order){
  return require('./dispatchedOrderEmailGenerator')();
}

module.exports = mailer;
