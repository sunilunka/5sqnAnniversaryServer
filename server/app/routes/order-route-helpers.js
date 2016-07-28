'use strict';
var path = require('path');

var mongoose = require('mongoose');

var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');
var _ = require('lodash');

var modifyMultipleProducts = function(product, operation, requestedAmount){
  if(product.hasOwnProperty('variant_id')){
    return Variant.findById(product.variant_id)
    .then(function(variant){
      return variant.updateStock(operation, requestedAmount)
    })
  } else {
    return Product.findById(product.product_id)
    .then(function(product){
      return product.updateStock(operation, requestedAmount);
    })
  }
}

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
      return modifyMultipleProducts(product, 'subtract', requestedAmount);
    })
    return Promise.all(itemsToUpdate);
  },

  amendOrderQuantities: function(itemsArray){

    var amendItemQuantity = function(availableQuantity, item){
      if(availableQuantity === item.quantity){
        return item;
      } else {
        item.amendedQuantity = availableQuantity;
        return item;
      }
    }

    var amendedOrder = itemsArray.map(function(item){
      if(item.hasOwnProperty('variant_id')){
        return Variant.checkStockAvailable(item.variant_id, item.quantity)
        .then(function(availableStock){
          return amendItemQuantity(availableStock, item);
        })
      } else {
        return Product.checkStockAvailable(item.product_id, item.quantity)
        .then(function(availableStock){
          return amendItemQuantity(availableStock, item);
        })
      }
    })
    return Promise.all(amendedOrder);
  },

  restockProducts: function(products){
    var stockToUpdate = products.map(function(product){
      var amountToAdd = product.quantity;
      return modifyMultipleProducts(product, 'add', amountToAdd);
    })
    return Promise.all(stockToUpdate);
  }


}
