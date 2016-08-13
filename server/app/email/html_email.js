'use strict';

var path = require('path');
var apiKey = require(path.join(__dirname, '../configure/authentication/sendgrid.json')).SEND_GRID_AUTH;
var sendGrid = require('sendgrid')(apiKey);
var mailHelper = require('sendgrid').mail;


var htmlEmailGenerator = function(data){
  console.log("DATA: " , data)
  this.data = Object.assign({}, data);
  console.log('THIS: ', this);
}

htmlEmailGenerator.prototype.sendGrid = sendGrid;

htmlEmailGenerator.prototype.mailHelper = mailHelper;

htmlEmailGenerator.prototype.message = function(){
  return new this.mailHelper.Mail();
}

htmlEmailGenerator.prototype.generaterHeader = function(titleText){
  return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtmll/DTD/xhtmll-transitional.dtd"><html lang="en-NZ"><head><meta charset="UTF-8"><title>' + titleText + '</title></head>';
}

module.exports = htmlEmailGenerator;
