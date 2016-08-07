'use strict';
var path = require('path');

var templateMethods = {};

var processOrderItems = function(orderObj){
  var orderTable = orderObj.products.map(function(product){
    return '<tr><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.title + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.display_options + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.quantity + '</td><td style="padding: 5px; color: #808080; background-color: #EFEFEF; font-family: sans-serif">' + product.subtotal + '</td></tr>';
  })

  return '<tbody>' + orderTable.join('') + '</tbody>';
}

templateMethods.emailOrderHeader = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtmll/DTD/xhtmll-transitional.dtd"><html lang="en-NZ"><head><meta charset="UTF-8"><title>5 SQN Anniversary Order Information</title></head>'

templateMethods.emailHeader = '<body><h2 style="background-color:#808080; color:#EFEFEF; padding: 10px; font-family: sans-serif;">5 Squadron - Celebrating 75 Years serving New Zealand</h2>'

templateMethods.emailOrderIntroHeader = function(orderObj){
  var firstName;
  if(orderObj['recipient']){
    firstName = orderObj.recipient.split(' ')[0];
  } else {
    firstName = 'Testing'
  }

  return  '<h3 style="color: #68AFC3; padding: 5px; font-family: sans-serif;">Hi ' + firstName + ' your order has been submitted!</h3>'
}

templateMethods.emailOrderRef = function(orderRef){
  return '<table style="width:98%;"><tbody style="background-color:#EFEFEF;"><tr><td><h4 style="background-color:#EFEFEF; color:#808080; padding: 10px; font-family: sans-serif; margin: 0px">Please make sure you keep a note of your order number: </h4></td></tr><tr><td><h3 style="background-color:#EFEFEF; color:#68AFC3; padding: 10px; font-family: sans-serif; margin: 0px">' + orderRef + '</h3></td></tr><tr><td style="background-color:#EFEFEF; color:#808080; padding:5px; font-family: sans-serif; margin: 0px">We will use this to verify your order on collection.</td></tr></tbody></table>'
}

templateMethods.emailOrderDetails = function(orderObj){
return '<h4 style="background-color:#68AFC3; color: #EFEFEF; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Order Details</h4><table style="width:98%"><tbody><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Name:</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.recipient + '</td></tr><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;"><strong>Delivery Method:</strong></td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">' + orderObj.pickUpDetails + '</td></tr></tbody></table>'
}

templateMethods.emailOrderTable = function(orderObj){
  return '<table style="width: 98%"><thead><tr><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Item</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Variant</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Qty</th><th style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px">Amount</th></tr></thead><tfoot><tr><td colspan="3" style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px"><strong>Total Amount to pay:</strong></td><td style="background-color:#808080; color: #EFEFEF; border: 1px solid #EFEFEF; font-family: sans-serif; padding: 5px"><strong>' + orderObj.totalPrice + '</strong></td></tr></tfoot>' + processOrderItems(orderObj) + '</table>';
}

templateMethods.emailOrderInstructions = function(orderObj){
  return '<table style="width:98%"><tr><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Please deposit the order amount into account: </td><td style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">12-3085-XXXXXXX-XX</td></tr><tr><td colspan="2" style="background-color:#EFEFEF; color: #68AFC3; padding: 5px; margin-top: 5px; margin-bottom: 2px; font-family: sans-serif;">Use ' + orderObj.order_ref + ' as the reference in your payment</td></tr></table>'
}

templateMethods.compileOrder = function(orderObj){
  return (templateMethods.emailOrderHeader + templateMethods.emailHeader + templateMethods.emailOrderIntroHeader(orderObj) + templateMethods.emailOrderRef(orderObj) + templateMethods.emailOrderDetails(orderObj) + templateMethods.emailOrderTable(orderObj) + templateMethods.emailOrderInstructions(orderObj)) + '</body></html>';
}



module.exports = templateMethods;
