'use strict';

var mailHelper = require('sendgrid').mail;

var templateMethods = require('./templating_methods');

var plainTextMethods = require('./plainText_templating');

var newAttendeeEmailGenerator = function(sendGrid, userData){

  var displayName = function(first, last){
    return first + " " + last;
  }

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('registration@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(userData.email, displayName(userData.firstName, userData.lastName));
  // var cc_address = new mailHelper.Email('test@test.com')
  personalization.addTo(to_address);
  // personalization.addCc(cc_address);
  personalization.setSubject('You are now registered for the 5 Squadron Anniversary Events.');

  message.addPersonalization(personalization);

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);
  // messageSettings.setSandBoxMode(sandbox_mode);

  message.addMailSettings(messageSettings);

  var plainMessageContent = new mailHelper.Content('text/plain', plainTextMethods.compileNewRegister(userData))

  var messageContent = new mailHelper.Content('text/html', templateMethods.compileNewRegister(userData));

  message.addContent(plainMessageContent);
  message.addContent(messageContent);

  var request = sendGrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: message.toJSON()
  })

  return sendGrid.API(request)
  .then(function(response){
    console.log("RESPONSE: ", response.statusCode)
    console.log("RESPONSE BODY: ", response.body)
    return response.statusCode;
  })
  .catch(function(err){
    console.log("ERROR: ", err);
    return err;
  })



}



module.exports = newAttendeeEmailGenerator
