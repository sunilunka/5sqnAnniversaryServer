'use strict';
var path = require('path');

var mongoose = require('mongoose');

var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');
var _ = require('lodash');

module.exports = {
  removeConflictingKeys: function(targetArray){
    return targetArray.map(function(item){
      if(item.hasOwnProperty('_id')){
        delete item._id
      }
      if(item.hasOwnProperty('__v')){
        delete item.__v;
      }
      return item;
    })
  },

  generateOrderRef: function(){
    return fireMethods.generateOrderRefNumber()
    .then(function(number){
      return '5SQN-75-' + number;
    })
  },

  modifyProductStock: function(productArray){
    var itemsToUpdate = productArray.map(function(product){
      var requestedAmount = product.quantity;
      if(product.hasOwnProperty('variant_id')){
        return Variant.findById(product.variant_id)
        .then(function(variant){
          return variant.updateStock('subtract', requestedAmount)
        })
      } else {
        return Product.findById(product.product_id)
        .then(function(product){
          return product.updateStock('subtract', requestedAmount);
        })
      }
    })
    return Promise.all(itemsToUpdate);
  },

  amendOrderQuantities: function(itemsArray){
    var amendedOrder = productsArray.map(function(item){
      if(item.hasOwnProperty('variant_id')){

      } else {

      }
    })
  }


}
