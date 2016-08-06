'use strict';
var path = require('path');
var apiKey = require(path.join(__dirname, '../configure/authentication/sendgrid.json')).SEND_GRID_AUTH;
var sg = require('sendgrid')(apiKey);


var mailHelper = require('sendgrid').mail;


var mailer = {};

mailer.generateOrderSuccessEmail = function(order){
  return require('./orderGen')(sg, order);
}

module.exports = mailer;
