'use strict';

var path = require('path');
var mailHelper =  require('sendgrid').mail;

var templateMethods = require('./templating_methods');
var plainTextMethods = require('./plainText_templating');

var emailGenerator = function(sendGrid, user, evt){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('payment_received@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(user.email, user.firstName);
  var cc_address = new mailHelper.Email('5sqnanniversary@nzdf.mil.nz')
  personalization.addTo(to_address);
  personalization.addCc(cc_address);
  personalization.setSubject('Your payment for ' + evt.name +' has been received.');

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', plainTextMethods.compileEventPaymentBody(evt, user));

  var messageContent = new mailHelper.Content('text/html', templateMethods.compileEventPaymentBody(evt, user));

  message.addContent(plainMessageContent);
  message.addContent(messageContent);

  console.log("HTML MESSAGE CONTENT: ", messageContent);
  console.log("PLAIN TEXT MESSAGE: ", plainMessageContent);

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
    return err;
  })
}



module.exports = emailGenerator;
