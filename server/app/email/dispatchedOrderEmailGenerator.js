'use strict';

var path = require('path');
var mailHelper =  require('sendgrid').mail;

var templateMethods = require('./templating_methods');
var plainTextMethods = require('./plainText_templating');

var compileDispatchHtml = function(order){
  return templateMethods.emailHtmlHeader('5 SQN Order dispatched') + templateMethods.emailHeader + templateMethods.emailDispatchedHeader(order) + templateMethods.emailDispatchedBody(order) + templateMethods.htmlEmailFooter() + '</body></html>';
}
var emailGenerator = function(sendGrid, order){

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('order_update@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(order.email, templateMethods.getFirstName(order));
  // var cc_address = new mailHelper.Email('test@test.com')
  personalization.addTo(to_address);
  // personalization.addCc(cc_address);
  personalization.setSubject('Your 5SQN order ' + order.order_ref +' has been dispatched.');

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  // messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', plainTextMethods.compileDispatchContent(order));

  var messageContent = new mailHelper.Content('text/html', compileDispatchHtml(order));

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



module.exports = emailGenerator;
