'use strict';

var path = require('path');

var plainTextMethods = {};

plainTextMethods.processOrderPayment = function(order){
  if(order.deliveryMethod === 'Post/Courier'){
    return 'Now we have received the payment your order will be shipped shortly.';
  } else {
    return 'Great, now do not forget to pick up your order at one of the events!\n\n';
  }
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

var processDisplayName = function(orderObj){
  var firstName;
  if(orderObj['recipient']){
    firstName = orderObj.recipient.split(' ')[0];
  } else {
    firstName = ','
  }
}

plainTextMethods.emailHeader = '5 Squadron - Celebrating 75 Years serving New Zealand \n\n'

plainTextMethods.emailOrderIntroHeader = function(orderObj){
  var firstName = processDisplayName(orderObj);
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
  return (plainTextMethods.emailHeader + plainTextMethods.emailOrderIntroHeader(orderObj) + plainTextMethods.emailOrderRef(orderObj) + plainTextMethods.emailOrderDetails(orderObj) + plainTextMethods.emailOrderTable(orderObj) + plainTextMethods.emailOrderInstructions(orderObj)) + '\n\n' + plainTextMethods.emailFooter();
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
  return 'We look forward to welcoming you back.\n\nKeitou Kalawaca Na Wasaliwa\n\n' + plainTextMethods.emailFooter();
}

plainTextMethods.emailFooter = function(){
  return 'Please do not reply to this email. If you need to make an enquiry please send correspondence to xxxx@nzdf.mil.nz\n'
}

plainTextMethods.compileNewRegister = function(userData){
  return (plainTextMethods.emailHeader + plainTextMethods.registerIntro(userData) + plainTextMethods.registerBody() + plainTextMethods.registerBilling('12-3085-XXXXXX-XXX')) + plainTextMethods.registerFooter();
}

plainTextMethods.generateDispatchHeader = function(order){
  return 'Hi, ' + processDisplayName(order) + ' your order ' + order.order_ref + ' is on its way!'
}

plainTextMethods.generateDispatchBody = function(order){
  return 'The tracking number for the delivery is ' + order.trackingData + 'You can also view the tracking number by logging into the anniversary website (https://5sqnrnzaf.firebaseapp.com) and viewing the order in your profile.'
}

plainTextMethods.generateOrderPaidBody = function(order){
  return 'Hi, ' + processDisplayName(order) + ' we have received your payment of $' + order.totalPrice + ' for order ' + order.order_ref + '.\n\n' + plainTextMethods.processOrderPayment(order) + plainTextMethods.emailFooter();
}

plainTextMethods.compileOrderPaidContent = function(order){
  return plainTextMethods.emailHeader + plainTextMethods.generateOrderPaidBody(order);
}

plainTextMethods.compileDispatchContent = function(order){
  return plainTextMethods.emailHeader + plainTextMethods.generateDispatchHeader(order) + plainTextMethods.generateDispatchBody(order) + plainTextMethods.emailFooter();
}

module.exports = plainTextMethods;
