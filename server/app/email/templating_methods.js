'use strict';
var path = require('path');

var plainTextMethods = require('./plainText_templating');

var templateMethods = {};

templateMethods.getFirstName = function(order){
  var firstName;
  if(order['recipient']){
    firstName = order.recipient.split(' ')[0];
  } else {
    firstName = ','
  }
  return firstName;
}

var processOrderItems = function(orderObj){

  var checkDisplayOptions = function(product){
    if(!product['display_options']){
      return ''
    } else {
      return product.display_options;
    }
  }

  var orderTable = orderObj.products.map(function(product){
    return '<tr><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.title + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + checkDisplayOptions(product) + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.quantity + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.subtotal + '</td></tr>';
  })

  return '<tbody>' + orderTable.join('') + '</tbody>';
}

var generateDeliverySection = function(orderObj){

  var generateDeliveryAddress = function(orderObj){
    var address = orderObj.address;
    return '<tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Address</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.recipient +'</td></tr><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + address.line_one + '</td></tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + address.line_two +'</td><tr></tr><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + address.city + '</td></tr><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + address.province + '</td></tr><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + address.post_code + '</td></tr>'
  }

  if(orderObj.deliveryMethod === 'Post/Courier'){
    return '<tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Delivery Method:</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.deliveryMethod + '</td></tr>'+ generateDeliveryAddress(orderObj) + '</tbody></table>';
  } else {
    return '<tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Delivery Method:</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.deliveryMethod + '</td></tr></tbody></table>';
  }
}

templateMethods.emailHtmlHeader = function(titleText){
  return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtmll/DTD/xhtmll-transitional.dtd"><html lang="en-NZ"><head><meta charset="UTF-8"><title>' + titleText + '</title></head>';
}

templateMethods.emailHeader = '<body><h2 style="background-color:#808080; color:#EFEFEF; padding: 10px; font-family: sans-serif;">5 Squadron - Celebrating 75 Years serving New Zealand</h2>'

templateMethods.emailOrderIntroHeader = function(orderObj){
  return  '<h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif;">Hi ' + templateMethods.getFirstName(orderObj) + ' your order has been submitted!</h3>'
}

templateMethods.emailDispatchedHeader = function(orderObj){
  return '<h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif;">Hi ' + templateMethods.getFirstName(orderObj) + ' your order <span style="color: #808080;"><strong>' + orderObj.order_ref + '</strong></span> has been dispatched and should be with you in a few days.</h3>'
}

templateMethods.emailOrderRef = function(orderObj){
  return '<table style="width:98%;"><tbody style="background-color:#EFEFEF;"><tr><td><h4 style="background-color:#EFEFEF; color:#808080; padding: 10px; font-family: sans-serif; margin: 0px">Please make sure you keep a note of your order number: </h4></td></tr><tr><td><h3 style="background-color:#EFEFEF; color:#68AFC3; padding: 10px; font-family: sans-serif; margin: 0px">' + orderObj.order_ref + '</h3></td></tr><tr><td style="background-color:#EFEFEF; color:#808080; padding:5px; font-family: sans-serif; margin: 0px">We will use this to verify your order on collection.</td></tr></tbody></table>'
}

templateMethods.emailOrderDetails = function(orderObj){
  return '<h4 style="background-color:#68AFC3; color: #EFEFEF; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Order Details</h4><table style="width:98%"><tbody><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Name:</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.recipient + '</td></tr>' + generateDeliverySection(orderObj) + '</tbody></table>';
}

templateMethods.emailOrderTable = function(orderObj){
  return '<table style="width: 98%"><thead><tr><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Item</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Variant</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Qty</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding:5px">Amount</th></tr></thead><tfoot><tr><td colspan="3" style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px"><strong>Total Amount to pay:</strong></td><td style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px"><strong>' + orderObj.totalPrice + '</strong></td></tr></tfoot>' + processOrderItems(orderObj) + '</table>';
}

templateMethods.emailOrderInstructions = function(orderObj){
  return '<table style="width:98%"><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Please deposit the order amount into account: </td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">12-3085-XXXXXXX-XX</td></tr><tr><td colspan="2" style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Use ' + orderObj.order_ref + ' as the reference in your payment</td></tr></table>'
}

templateMethods.compileOrder = function(orderObj){
  return (templateMethods.emailHtmlHeader('5 SQN Anniversary Order Information') + templateMethods.emailHeader + templateMethods.emailOrderIntroHeader(orderObj) + templateMethods.emailOrderRef(orderObj) + templateMethods.emailOrderDetails(orderObj) + templateMethods.emailOrderTable(orderObj) + templateMethods.emailOrderInstructions(orderObj)) + templateMethods.htmlEmailFooter() + '</body></html>';
}

templateMethods.registerIntro = function(userData){
  return '<h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif;">Hi, ' + userData.firstName + ' you are now registered for the 5 SQN Anniversary Event.</h3>';
}

templateMethods.registerBody = function(){
  return '<p style="background-color: #EFEFEF; color: #808080; padding: 5px; margin: 0px; font-family: sans-serif">You can log back into the 5 SQN Anniversary website at any time to change the events you are attending, guests and order Anniversary memorabilia.</p><p style="background-color: #EFEFEF; color: #808080; padding:5px; margin: 0px; font-family: sans-serif">We will also send updates on event details and other features available via the website.</p>';
}

templateMethods.registerBilling = function(accountNumber){
  return '<p style="background-color: #EFEFEF; color: #808080; padding:5px; margin: 0px; font-family: sans-serif"><strong>Payments for tickets and orders can be made to <em>' + accountNumber + '</em></strong></p>'
}

templateMethods.registerFooter = function(){
  return '<h4 style="background-color: #EFEFEF; color: #68AFC3; padding: 5px; margin: 0px; font-family: sans-serif">We look forward to welcoming you back.</h4><h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif"><em>"Keitou Kalawaca Na Wasaliwa"</em></h3>'
}

templateMethods.compileNewRegister = function(userData){
  return (templateMethods.emailHtmlHeader('You are now registered for the 5SQN Anniversary Events') + templateMethods.emailHeader + templateMethods.registerIntro(userData) + templateMethods.registerBody() + templateMethods.registerBilling('12-3085-XXXXXX-XXX')) + templateMethods.registerFooter() +  templateMethods.htmlEmailFooter() + '</body></html>';
}

templateMethods.emailDispatchedBody = function(order){
  return '<p style="background-color: #EFEFEF; color: #808080; padding: 5px; margin: 0px; font-family: sans-serif">The tracking number for the delivery is <strong>' + order.trackingData + '</strong>.</p><p style="background-color: #EFEFEF; color: #808080; padding:5px; margin: 0px; font-family: sans-serif">You can also view the tracking number by logging into the <a href="https://5sqnrnzaf.firebaseapp.com">anniversary website</a> and viewing the order in your profile.</p>'
}

templateMethods.generateOrderPaidBody = function(order){
  return '<h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif;">Hi, ' + templateMethods.getFirstName(order) + ' we have received your payment of <span style="color: #808080"><strong>$' + order.totalPrice + '</strong></span> for order <strong>' + order.order_ref + '</strong>.</h3><p style="background-color: #EFEFEF; color: #808080; padding: 5px; margin: 0px; font-family: sans-serif">'  + plainTextMethods.processOrderPayment(order) + '</p>';
}

templateMethods.htmlEmailFooter = function(){
  return '<p style="background-color: #808080; color: #EFEFEF; font-family: sans-serif; font-size: 10px; padding: 5px;">Please do not reply to this email. The 5SQN Store email server is notification only. If you have an enquiry, please send it to <a href="mailto:5sqntest@nzdf.mil.nz">the committee.</a>Thanks, we look forward to commemorating the anniversary with you.</p>'
}


module.exports = templateMethods;
