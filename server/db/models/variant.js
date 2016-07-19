'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var modelHelpers = require('./model-helpers')

var transformToCents = function(value){
  if(typeof value === 'Number'){
    return value;
  }
  return parseFloat(value) * 100;
}

var transformToString = function(num){
  return (num / 100).toFixed(2);
}

var variantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId
  },
  options: {
    type: {},
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'No stock available'],
    default: 0
  },
  price: {
    type: Number,
    required: true,
    get: transformToString,
    set: transformToCents
  },
  imageURL: {
    type: String
  },

  imageName: {
    type: String
  }

})

variantSchema.methods.updateStock = function(operation, amount, cb){
  return modelHelpers.updateStock.call(this, operation, amount, cb)
}

mongoose.model('Variant', variantSchema);
