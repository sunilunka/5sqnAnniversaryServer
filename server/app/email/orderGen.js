'use strict';

var mailHelper = require('sendgrid').mail;

var orderEmailGenerator = function(orderObj){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('orders@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(orderObj.email, orderObj.recipient);
  personalization.addTo(to_address);
  console.log("MAIL: ", message);
  return message;



}



module.exports = orderEmailGenerator
