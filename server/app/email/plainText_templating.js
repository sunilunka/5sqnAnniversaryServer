'use strict';

var path = require('path');

var plainTextMethods = {};

var processOrderItems = function(orderObj){

  var checkDisplayOptions = function(product){
    if(!product['display_options']){
      return ''
    } else {
      return product.display_options;
    }
  }

  var orderTable = orderObj.products.map(function(product){
    return product.title + '\t' + checkDisplayOptions(product) + '\t' + product.quantity + '\t' + product.subtotal + '\n';
  })

  return orderTable.join('') + '\n';
}

var checkShippingPrice = function(orderObj){
  if(orderObj['shippingPrice']){
    return 'Shipping Cost: \t' + orderObj.shippingPrice + '\n'
  } else {
    return 'No Shipping Required \n';
  }
}


plainTextMethods.emailHeader = '5 Squadron - Celebrating 75 Years serving New Zealand \n\n'

plainTextMethods.emailOrderIntroHeader = function(orderObj){
  var firstName;
  if(orderObj['recipient']){
    firstName = orderObj.recipient.split(' ')[0];
  } else {
    firstName = ','
  }

  return  'Hi ' + firstName + ' your order has been submitted!\n\n'
}

plainTextMethods.emailOrderRef = function(orderObj){
  return 'Please make sure you keep a note of your order number:\n\t * ' + orderObj.order_ref + ' *\n\nWe will use this to verify your order on collection.\n\n'
}

plainTextMethods.emailOrderDetails = function(orderObj){
  if(orderObj.deliveryMethod === 'Post/Courier'){
    return 'Order Details\n-------------\n\nNAME: \t' + orderObj.recipient + '\nDelivery Method: \t' + orderObj.deliveryMethod + '\nDelivery Address:\t' + orderObj.address.line_one +'\n\t' + orderObj.address.line_two + '\n\t' + orderObj.address.city + '\n\t' + orderObj.address.province + '\n\t'
    + orderObj.address.post_code + '\t\n';
  } else {
    return 'Order Details\n-------------\n\nNAME: \t' + orderObj.recipient + '\nDelivery Method: \t' + orderObj.deliveryMethod + '\n\n';
  }
}

plainTextMethods.emailOrderTable = function(orderObj){
  return 'Title | Variant | Quantity | Subtotal | \n----- | ------- | -------- | -------- | ' + checkShippingPrice(orderObj) + processOrderItems(orderObj) + 'Total Price:\t$' + orderObj.totalPrice + '\n\n';
}

plainTextMethods.emailOrderInstructions = function(orderObj){
  return 'Please deposit the order amount into account: 12-3085-XXXXXXX-XX\n\nUse ' + orderObj.order_ref + ' as the reference in your payment.'
}

plainTextMethods.compileOrder = function(orderObj){
  return (plainTextMethods.emailHeader + plainTextMethods.emailOrderIntroHeader(orderObj) + plainTextMethods.emailOrderRef(orderObj) + plainTextMethods.emailOrderDetails(orderObj) + plainTextMethods.emailOrderTable(orderObj) + plainTextMethods.emailOrderInstructions(orderObj)) + '\n';
}

plainTextMethods.registerIntro = function(userData){
  return 'Hi, ' + userData.firstName + ' you are now registered for the 5 SQN Anniversary Event.\n';
}

plainTextMethods.registerBody = function(){
  return 'You can log back into the 5 SQN Anniversary website at any time to change the events you are attending, guests and order Anniversary memorabilia.\n\nWe will also send updates on event details and other features available via the website.\n\n';
}

plainTextMethods.registerBilling = function(accountNumber){
  return 'Payments for tickets and orders can be made to' + accountNumber + '\n';
}

plainTextMethods.registerFooter = function(){
  return 'We look forward to welcoming you back.\n\nKeitou Kalawaca Na Wasaliwa'
}

plainTextMethods.compileNewRegister = function(userData){
  return (plainTextMethods.emailHeader + plainTextMethods.registerIntro(userData) + plainTextMethods.registerBody() + plainTextMethods.registerBilling('12-3085-XXXXXX-XXX')) + plainTextMethods.registerFooter();
}


module.exports = plainTextMethods;
