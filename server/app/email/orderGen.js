'use strict';

var mailHelper = require('sendgrid').mail;

var generateOrderEmailBody = function(orderObj){
  
}

var orderEmailGenerator = function(sendGrid, orderObj){

  console.log("SEND GRID: ", sendGrid);

  var message = new mailHelper.Mail();

  message.setFrom(new mailHelper.Email('orders@5sqnrnzaf.firebaseapp.com'));

  var personalization = new mailHelper.Personalization();

  var to_address = new mailHelper.Email(orderObj.email, orderObj.recipient);
  var cc_address = new mailHelper.Email('test@test.com')
  personalization.addTo(to_address);
  personalization.addCc(cc_address);
  personalization.setSubject('Your order for 5 SQN Anniversary products has been recieved.')

  var messageSettings = new mailHelper.MailSettings();

  var sandbox_mode = new mailHelper.SandBoxMode(true);

  message.addMailSettings(messageSettings);

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


  // return message;



}



module.exports = orderEmailGenerator
