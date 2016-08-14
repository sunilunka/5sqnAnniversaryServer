'use strict';

var path = require('path');
var mailHelper = require('sendgrid').mail;

var htmlTempalateMethods = require('./templating_methods');

var plainTextMethods = require('./plainText_templating');

var generateGroupEmail = function(sendGrid, emailData){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('updates@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(emailData.user.email, emailData.user.recipientName);
  // var cc_address = new mailHelper.Email('test@test.com')
  personalization.addTo(to_address);
  // personalization.addCc(cc_address);
  personalization.setSubject(emailData.subject);

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', plainTextMethods.compileCustomContent(emailData.body));

  var messageContent = new mailHelper.Content('text/html', compileCustomHtml(emailData.body));

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
    return err;
  })

}


module.exports = generateGroupEmail
