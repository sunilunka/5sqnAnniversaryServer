'use strict';

var path = require('path');
var mailHelper = require('sendgrid').mail;

var htmlTemplateMethods = require('./templating_methods');

var plainTextMethods = require('./plainText_templating');

var compileCustomHtml = function(content, user){
  return htmlTemplateMethods.emailHtmlHeader('5 SQN Anniversary Update') + htmlTemplateMethods.emailHeader + 'Hi ' + user.firstName + ', ' + htmlTemplateMethods.compileCustomBody(content) + htmlTemplateMethods.htmlEmailFooter() + '</body></html>';
}

var generateGroupEmail = function(sendGrid, emailData, userData){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('updates@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(userData.email, userData.firstName);
  personalization.addTo(to_address);
  personalization.setSubject(emailData.subject);

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', plainTextMethods.compileCustomContent(emailData.body, userData));

  var messageContent = new mailHelper.Content('text/html', compileCustomHtml(emailData.body, userData));

  message.addContent(plainMessageContent);
  message.addContent(messageContent);
  console.log("MESSAGE CONTENT: ", messageContent);
  var request = sendGrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: message.toJSON()
  })

  return sendGrid.API(request)
  .then(function(response){
    console.log("RESPONSE: ", response.statusCode);
    console.log("RESPONSE: ", response.body);
    return response.statusCode;
  })
  .catch(function(err){
    return err;
  })

}


module.exports = generateGroupEmail
