'use strict';

var mailHelper = require('sendgrid').mail;

var templateMethods = require('./templating_methods');
var plainTextMethods = require('./plainText_templating');

var generateOrderEmailBody = function(orderObj){
  return templateMethods.compileOrder(orderObj);
}

var generatePlainOrder = function(orderObj){
  return plainTextMethods.compileOrder(orderObj);
}

var orderEmailGenerator = function(sendGrid, orderObj){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('orders@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(orderObj.email, orderObj.recipient);
  var cc_address = new mailHelper.Email('5sqnanniversary@nzdf.mil.nz')
  personalization.addTo(to_address);
  personalization.addCc(cc_address);
  personalization.setSubject('Your order for 5 SQN Anniversary products has been recieved.');

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', generatePlainOrder(orderObj))

  var messageContent = new mailHelper.Content('text/html', generateOrderEmailBody(orderObj));

  message.addContent(plainMessageContent);
  message.addContent(messageContent);

  var request = sendGrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: message.toJSON()
  })

  return sendGrid.API(request)
  .then(function(response){
    return response.statusCode;
  })
  .catch(function(err){
    console.log("ERROR: ", err);
    return err;
  })



}



module.exports = orderEmailGenerator
